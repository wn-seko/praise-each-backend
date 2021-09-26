import knexLib from 'knex'
import { env } from '~/env'

export const getDatabaseEngine = (): knexLib =>
  knexLib({
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
    acquireConnectionTimeout: env.DB_CONNECTION_TIMEOUT,
  })

export const knex = getDatabaseEngine()
