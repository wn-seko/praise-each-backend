import Router from '@koa/router'
import Koa from 'koa'
import * as praiseController from '~/controllers/praise'
import * as rootController from '~/controllers/root'

const rootRouter = new Router()

rootRouter.get('/', rootController.healthCheck)

const praiseRouter = new Router({ prefix: '/praises' })

praiseRouter
  .get('/', praiseController.listPraises)
  .get('/:id', praiseController.getPraise)
  .post('/', praiseController.createPraise)
  .put('/:id', praiseController.updatePraise)
  .delete('/:id', praiseController.deletePraise)

const routerList = [rootRouter, praiseRouter]

export const routers = (app: Koa): void => {
  for (const router of routerList) {
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}
