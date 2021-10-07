import jwt from 'jsonwebtoken'
import { Context, Middleware, Next } from 'koa'
import { User } from '~/domains/entities/user'
import { env } from '~/env'

export interface CustomContext extends Context {
  authUserId: string
}

export const authParser = (): Middleware => {
  return async (ctx: Context, next: Next) => {
    try {
      const token = ctx.header.authorization?.split(' ')[1] || ''
      const decoded = jwt.verify(token, env.APPLICATION_SECRET)
      const { id } = decoded as User
      ctx.authUserId = id
    } catch (error) {
      ctx.authUserId = ''
    }

    await next()
  }
}
