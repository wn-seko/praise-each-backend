import { CustomContext } from '~/middlewares/context'
import { TeamPinService } from '~/services/teamPin'

export class TeamPinController {
  private readonly teamPinService: TeamPinService

  public constructor(teamPinService: TeamPinService) {
    this.teamPinService = teamPinService
  }

  public async createTeamPin(ctx: CustomContext): Promise<void> {
    const { teamId } = ctx.request.body || {}
    const userId = ctx.authUserId
    const teamPin = await this.teamPinService.createTeamPin(userId, teamId)
    ctx.status = 201
    ctx.body = teamPin
  }

  public async getTeamPinByUserId(ctx: CustomContext): Promise<void> {
    const userId = ctx.authUserId
    const teamPins = await this.teamPinService.getTeamPinByUserId(userId)
    ctx.body = teamPins
  }

  public async deleteTeamPin(ctx: CustomContext): Promise<void> {
    const { teamId } = ctx.params
    const userId = ctx.authUserId
    const deletedId = await this.teamPinService.deleteTeamPin(userId, teamId)
    ctx.status = 200
    ctx.body = { id: deletedId }
  }
}
