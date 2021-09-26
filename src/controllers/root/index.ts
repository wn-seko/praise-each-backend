import Koa from 'koa'

export const healthCheck = async (ctx: Koa.Context): Promise<void> => {
  ctx.body = 'OK'
}
