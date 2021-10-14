import Koa from 'koa'
import { oauthRouter } from '~/controllers/oauth'
import { praiseRouter } from '~/controllers/praise'
import { rootRouter } from '~/controllers/root'
import { teamRouter } from '~/controllers/team'
import { userRouter } from '~/controllers/user'

const routerList = [
  rootRouter,
  oauthRouter,
  praiseRouter,
  userRouter,
  teamRouter,
]

export const routers = (app: Koa): void => {
  for (const router of routerList) {
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}
