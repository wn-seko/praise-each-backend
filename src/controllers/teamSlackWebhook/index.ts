import Router from '@koa/router'
import { TeamSlackWebhookController } from './teamSlackWebhook'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { TeamSlackWebhookService } from '~/services/teamSlackWebhook'

const teamSlackWebhookService = container.get<TeamSlackWebhookService>(
  TYPES.TeamSlackWebhookService,
)
const teamSlackWebhookController = new TeamSlackWebhookController(
  teamSlackWebhookService,
)

export const teamSlackWebhookRouter = new Router({
  prefix: '/teamSlackWebhooks',
})

teamSlackWebhookRouter
  .get('/', teamSlackWebhookController.list.bind(teamSlackWebhookController))
  .put(
    '/:id',
    teamSlackWebhookController.update.bind(teamSlackWebhookController),
  )
  .post('/', teamSlackWebhookController.create.bind(teamSlackWebhookController))
  .delete(
    '/:id',
    teamSlackWebhookController.delete.bind(teamSlackWebhookController),
  )
