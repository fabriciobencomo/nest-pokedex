<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Excecute In Development

1. Clone the Repository
2. Execute

```
yarn install
```
3. Install Nest CLI

```
npm i -g @nestjs/cli
```

4. Up The Database

```
docker-compose up -d
```

5. Clone The File __.env.template__ y rename the copy to __.env__

6. Fill the Env Vars defined in __.env__

7. execute the application
```
yarn start:dev
```

8. Recreate Database with seed
```
localhost:3000/api/v2/seed
```

## Stack

* MongoDB
* Nest

# Production Build

1. Create the file ```.env.prod```
2. Fill the Env vars of Production
3. Create the Image
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build

```



