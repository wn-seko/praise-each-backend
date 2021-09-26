import { PraiseController } from './praise'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { PraiseService } from '~/services/praise'

const praiseService = container.get<PraiseService>(TYPES.PraiseService)
const praiseController = new PraiseController(praiseService)

export const listPraises = praiseController.listPraises.bind(praiseController)
export const getPraise = praiseController.getPraise.bind(praiseController)
export const createPraise = praiseController.createPraise.bind(praiseController)
export const updatePraise = praiseController.updatePraise.bind(praiseController)
export const deletePraise = praiseController.deletePraise.bind(praiseController)
