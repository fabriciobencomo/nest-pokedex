import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/paginationDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon
    } catch (error) {
      this.handleExceptions(error)
    }


  }

  async findAll(paginationDto: PaginationDto) {

    const {limit = 10, offset = 0} = paginationDto

    return await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({no: 1})
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term)
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)


    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true})
      return {...pokemon.toJSON(), ...updatePokemonDto} 
    }catch (error) {
      this.handleExceptions(error)
    }


  }

  async remove(id: string) {
    // const result = await this.pokemonModel.findByIdAndDelete(id)
    const result = await this.pokemonModel.deleteOne({_id: id})
    if(result.deletedCount === 0) throw new BadRequestException(`Pokemon with id ${id} not found`)
    return result
  }


  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exitst in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't create Pokemon - Check Server logs`)
  }
}
