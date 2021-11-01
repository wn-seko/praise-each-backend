export type NodeEnv = 'development' | 'production' | 'test'

export type Environment = {
  NODE_ENV: NodeEnv
  APPLICATION_SECRET: string
  DB_HOST: string
  DB_PORT: number
  DB_NAME: string
  DB_USER: string
  DB_PASSWORD: string
  DB_POOL_MIN: number
  DB_POOL_MAX: number
  DB_CONNECTION_TIMEOUT: number
  OAUTH_GITHUB_CLIENT_ID: string
  OAUTH_GITHUB_CLIENT_SECRET: string
  OAUTH_GITHUB_CALLBACK_URL: string
  OAUTH_GITHUB_DOMAIN: string
  OAUTH_GOOGLE_CLIENT_ID: string
  OAUTH_GOOGLE_CLIENT_SECRET: string
  OAUTH_GOOGLE_CALLBACK_URL: string
  DEBUG_RESPONSE_ENABLED: boolean
}
