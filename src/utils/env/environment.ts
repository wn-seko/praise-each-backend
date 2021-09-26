export type NodeEnv = 'development' | 'production' | 'test'

export type Environment = {
  NODE_ENV: NodeEnv
  DB_HOST: string
  DB_PORT: number
  DB_NAME: string
  DB_USER: string
  DB_PASSWORD: string
  DB_POOL_MIN: number
  DB_POOL_MAX: number
  DB_CONNECTION_TIMEOUT: number
  DEBUG_RESPONSE_ENABLED: boolean
}
