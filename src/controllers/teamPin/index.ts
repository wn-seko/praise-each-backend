import Router from '@koa/router'
import { TeamPinController } from './teamPin'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { TeamPinService } from '~/services/teamPin'

const teamPinService = container.get<TeamPinService>(TYPES.TeamPinService)
const teamPinController = new TeamPinController(teamPinService)

export const teamPinRouter = new Router({ prefix: '/teamPins' })

teamPinRouter
  .get('/', teamPinController.getTeamPinByUserId.bind(teamPinController))
  .post('/', teamPinController.createTeamPin.bind(teamPinController))
  .delete('/:teamId', teamPinController.deleteTeamPin.bind(teamPinController))
