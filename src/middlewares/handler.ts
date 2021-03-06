import { Middleware, Context, Next } from 'koa'
import { env } from '~/env'
import { ApplicationError, ErrorCode, errorCode } from '~/services/errors'

const createSystemError = (error: Error): ApplicationError =>
  new ApplicationError(
    errorCode.SYSTEM_ERROR,
    'unknown error',
    {},
    error as Error,
  )

const getResponseStatus = (errorCode: ErrorCode): number => {
  switch (errorCode) {
    case 'AUTHENTICATION_ERROR':
      return 401
    case 'INVALID_PARAMETER':
      return 400
    case 'NOT_FOUND':
      return 404
    case 'FORBIDDEN':
      return 403
    case 'DUPLICATION_ERROR':
      return 409
    case 'RESOURCE_CONFLICT':
      return 409
    case 'SYSTEM_ERROR':
      return 500
  }
}

const createApplicationError = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error != null &&
    (error as { status: number })?.status === 401
  ) {
    return new ApplicationError(
      errorCode.AUTHENTICATION_ERROR,
      'Login token is invalid or expired.',
    )
  }

  return error instanceof ApplicationError
    ? error
    : createSystemError(error as Error)
}

export const handler = (): Middleware => {
  return async (ctx: Context, next: Next) => {
    try {
      await next()

      if (ctx.status === 404) {
        ctx.throw(
          new ApplicationError(errorCode.NOT_FOUND, 'resource not found.'),
        )
      }
    } catch (error) {
      const appError = createApplicationError(error)

      if (appError.code === errorCode.SYSTEM_ERROR) {
        console.error(error)
      }

      const debug = env.DEBUG_RESPONSE_ENABLED
        ? {
            trace: appError.stack,
            innerError: appError.innerError
              ? {
                  message: appError.innerError?.message,
                  trace: appError.innerError?.stack,
                }
              : undefined,
          }
        : undefined

      ctx.status = getResponseStatus(appError.code)
      ctx.body = {
        payload: null,
        error: {
          code: appError.code,
          message: appError.message,
          params: appError.params,
        },
        debug,
      }
    }
  }
}
