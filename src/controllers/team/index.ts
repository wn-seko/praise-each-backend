import Router from '@koa/router'
import { TeamController } from './team'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { TeamPresenter } from '~/presenter/team'
import { TeamService } from '~/services/team'

const teamService = container.get<TeamService>(TYPES.TeamService)
const teamPresenter = container.get<TeamPresenter>(TYPES.TeamPresenter)
const teamController = new TeamController(teamService, teamPresenter)

export const teamRouter = new Router({ prefix: '/teams' })

teamRouter
  .get('/', teamController.listTeams.bind(teamController))
  .post('/', teamController.createTeam.bind(teamController))
  .get('/:id', teamController.getTeam.bind(teamController))
  .put('/:id', teamController.updateTeam.bind(teamController))
  .delete('/:id', teamController.deleteTeam.bind(teamController))
  .put('/:id/users', teamController.updateUsers.bind(teamController))
  .post('/:id/users', teamController.addUser.bind(teamController))
  .delete(
    '/:teamId/users/:userId',
    teamController.removeUser.bind(teamController),
  )
