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
  .post('/:id/likes', praiseController.createPraiseLike.bind(praiseController))
  .delete(
    '/:id/likes',
    praiseController.deletePraiseLike.bind(praiseController),
  )
  .post(
    '/:id/up_votes',
    praiseController.createPraiseUpVote.bind(praiseController),
  )
  .delete(
    '/:id/up_votes',
    praiseController.deletePraiseUpVote.bind(praiseController),
  )
  .post(
    '/:id/stamps/:stampId',
    praiseController.createPraiseStamp.bind(praiseController),
  )
  .delete(
    '/:id/stamps/:stampId',
    praiseController.deletePraiseStamp.bind(praiseController),
  )
