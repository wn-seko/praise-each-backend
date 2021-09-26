import Koa from 'koa'
import { praiseRouter } from '~/controllers/praise'
import { rootRouter } from '~/controllers/root'
import { userRouter } from '~/controllers/user'

const routerList = [rootRouter, praiseRouter, userRouter]

export const routers = (app: Koa): void => {
  for (const router of routerList) {
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}
