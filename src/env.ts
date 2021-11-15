import { Environment } from './utils/env/environment'
import {
  toNodeEnv,
  toString,
  toNumberOrUndefined,
  toStringOrUndefined,
} from './utils/env/validator'

export type EnvironmentValidators = {
  [k in keyof Environment]: (key: string) => Environment[k]
}

export const envValidators: EnvironmentValidators = {
  NODE_ENV: toNodeEnv,
  APPLICATION_SECRET: toString,
  DB_HOST: toString,
  DB_PORT: (key) => toNumberOrUndefined(key) ?? 5432,
  DB_NAME: toString,
  DB_USER: toString,
  DB_PASSWORD: toString,
  DB_POOL_MIN: (key) => toNumberOrUndefined(key) ?? 2,
  DB_POOL_MAX: (key) => toNumberOrUndefined(key) ?? 10,
  DB_CONNECTION_TIMEOUT: (key) => toNumberOrUndefined(key) ?? 60000,
  OAUTH_GITHUB_CLIENT_ID: (key) => toStringOrUndefined(key) ?? '',
  OAUTH_GITHUB_CLIENT_SECRET: (key) => toStringOrUndefined(key) ?? '',
  OAUTH_GITHUB_CALLBACK_URL: (key) => toStringOrUndefined(key) ?? '',
  OAUTH_GITHUB_DOMAIN: (key) => toStringOrUndefined(key) ?? 'github.com',
  OAUTH_GOOGLE_CLIENT_ID: (key) => toStringOrUndefined(key) ?? '',
  OAUTH_GOOGLE_CLIENT_SECRET: (key) => toStringOrUndefined(key) ?? '',
  OAUTH_GOOGLE_CALLBACK_URL: (key) => toStringOrUndefined(key) ?? '',
  APPLICATION_URL: (key) => toStringOrUndefined(key) ?? '',
  // eslint-disable-next-line no-process-env
  DEBUG_RESPONSE_ENABLED: () => process.env.NODE_ENV === 'development',
}

export const env = Object.fromEntries(
  Object.entries(envValidators).map(([k, v]) => [k, v(k)]),
) as Environment
