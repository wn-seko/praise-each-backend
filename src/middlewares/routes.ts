import Koa from 'koa'
import { oauthRouter } from '~/controllers/oauth'
import { praiseRouter } from '~/controllers/praise'
import { rootRouter } from '~/controllers/root'
import { tagRouter } from '~/controllers/tag'
import { teamRouter } from '~/controllers/team'
import { teamPinRouter } from '~/controllers/teamPin'
import { userRouter } from '~/controllers/user'

const routerList = [
  rootRouter,
  oauthRouter,
  praiseRouter,
  userRouter,
  teamRouter,
  teamPinRouter,
  tagRouter,
]

export const routers = (app: Koa): void => {
  for (const router of routerList) {
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}
