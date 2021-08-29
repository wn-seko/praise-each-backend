import knex from 'knex'
import { env } from './src/env'

const config: knex.Config = {
  client: 'postgresql',
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
  },
  migrations: {
    directory: './src/infrastructures/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/infrastructures/seeds',
  },
}

module.exports = config
