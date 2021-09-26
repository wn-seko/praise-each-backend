import Router from '@koa/router'
import { PraiseController } from './praise'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { PraisePresenter } from '~/presenter/praise'
import { PraiseService } from '~/services/praise'

const praiseService = container.get<PraiseService>(TYPES.PraiseService)
const praisePresenter = container.get<PraisePresenter>(TYPES.PraisePresenter)
const praiseController = new PraiseController(praiseService, praisePresenter)

export const praiseRouter = new Router({ prefix: '/praises' })

praiseRouter
  .get('/', praiseController.listPraises.bind(praiseController))
  .get('/:id', praiseController.getPraise.bind(praiseController))
  .post('/', praiseController.createPraise.bind(praiseController))
  .put('/:id', praiseController.updatePraise.bind(praiseController))
  .delete('/:id', praiseController.deletePraise.bind(praiseController))
