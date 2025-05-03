export const EnvConfiguration = () => ({
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3001,
  mongodb: process.env.MONGODB
})