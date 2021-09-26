import Router from '@koa/router'
import Koa from 'koa'

export const healthCheck = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = 'OK'
}

export const rootRouter = new Router()

rootRouter.get('/', healthCheck)
