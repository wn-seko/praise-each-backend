import Router from '@koa/router'
import { TagController } from './tag'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { TagService } from '~/services/tag'

const tagService = container.get<TagService>(TYPES.TagService)
const tagController = new TagController(tagService)

export const tagRouter = new Router({ prefix: '/tags' })

tagRouter
  .get('/', tagController.list.bind(tagController))
  .post('/', tagController.create.bind(tagController))
  .delete('/:id', tagController.delete.bind(tagController))
