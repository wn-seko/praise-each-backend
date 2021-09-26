import { Middleware, Context, Next } from 'koa'
import { env } from './env'
import { ApplicationError } from './services/errors'

export const handler = (): Middleware => {
  return async (ctx: Context, next: Next) => {
    try {
      await next()
      if (ctx.status === 404) {
        ctx.throw(new ApplicationError(404, { code: 'notfound' }))
      }
    } catch (error) {
      const appError =
        error instanceof ApplicationError
          ? error
          : new ApplicationError(500, { code: 'unknown' }, error as Error)
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

      ctx.status = appError.status
      ctx.body = {
        payload: null,
        error: {
          code: appError.code,
          params: appError.params,
        },
        debug,
      }
    }
  }
}
