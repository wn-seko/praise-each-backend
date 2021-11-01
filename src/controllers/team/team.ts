import { CustomContext } from '~/middlewares/context'
import { TeamPresenter } from '~/presenter/team'
import { TeamService } from '~/services/team'

export class TeamController {
  private readonly teamService: TeamService
  private readonly teamPresenter: TeamPresenter

  public constructor(teamService: TeamService, teamPresenter: TeamPresenter) {
    this.teamService = teamService
    this.teamPresenter = teamPresenter
  }

  public async createTeam(ctx: CustomContext): Promise<void> {
    const { name, color } = ctx.request.body || {}
    const team = await this.teamService.createTeam(name, color)
    ctx.status = 201
    ctx.body = await this.teamPresenter.teamToResponse(team)
  }

  public async listTeams(ctx: CustomContext): Promise<void> {
    const { word, offset, limit } = ctx.request.query || {}
    const sanitizedOffset = isNaN(Number(offset)) ? 0 : Number(offset)
    const sanitizedLimit = isNaN(Number(limit)) ? 20 : Number(limit)

    let result

    if (typeof word === 'string') {
      result = await this.teamService.search(
        word,
        sanitizedOffset,
        sanitizedLimit,
      )
    } else {
      result = await this.teamService.listTeams(sanitizedOffset, sanitizedLimit)
    }

    ctx.status = 200
    ctx.body = {
      ...result,
      list: await this.teamPresenter.teamsToResponse(result.list),
    }
  }

  public async getTeam(ctx: CustomContext): Promise<void> {
    const team = await this.teamService.getTeam(ctx.params['id'])
    ctx.body = team ? await this.teamPresenter.teamToResponse(team) : null
  }

  public async updateTeam(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const { name, color } = ctx.request.body
    const team = await this.teamService.updateTeam(id, name, color)
    ctx.status = 200
    ctx.body = team ? await this.teamPresenter.teamToResponse(team) : null
  }

  public async deleteTeam(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const deletedId = await this.teamService.deleteTeam(id)
    ctx.status = 200
    ctx.body = { id: deletedId }
  }

  public async addUser(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const userId = ctx.authUserId
    const team = await this.teamService.addUser(id, userId)

    ctx.body = team ? await this.teamPresenter.teamToResponse(team) : null
  }

  public async removeUser(ctx: CustomContext): Promise<void> {
    const { teamId, userId } = ctx.params
    const team = await this.teamService.removeUser(teamId, userId)

    ctx.body = team ? await this.teamPresenter.teamToResponse(team) : null
  }

  public async updateUsers(ctx: CustomContext): Promise<void> {
    const { id: teamId } = ctx.params
    const { userIds } = ctx.request.body
    const team = await this.teamService.updateUsers(teamId, userIds)

    ctx.status = 200
    ctx.body = team ? await this.teamPresenter.teamToResponse(team) : null
  }
}
