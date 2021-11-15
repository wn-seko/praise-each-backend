import { CustomContext } from '~/middlewares/context'
import { TeamSlackWebhookService } from '~/services/teamSlackWebhook'

export class TeamSlackWebhookController {
  private readonly teamSlackWebhookService: TeamSlackWebhookService

  public constructor(teamSlackWebhookService: TeamSlackWebhookService) {
    this.teamSlackWebhookService = teamSlackWebhookService
  }

  public async create(ctx: CustomContext): Promise<void> {
    const { teamId, url, name, description } = ctx.request.body || {}
    const teamSlackWebhook = await this.teamSlackWebhookService.create(
      teamId,
      url,
      name,
      description,
    )
    ctx.status = 201
    ctx.body = teamSlackWebhook
  }

  public async list(ctx: CustomContext): Promise<void> {
    const { teamId = '' } = ctx.query
    const sanitizedTeamId = typeof teamId === 'string' ? teamId : teamId[0]
    const teamSlackWebhooks = await this.teamSlackWebhookService.list(
      sanitizedTeamId,
    )
    ctx.body = teamSlackWebhooks
  }

  public async update(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const { url, name, description } = ctx.request.body || {}
    const teamSlackWebhook = await this.teamSlackWebhookService.update(
      id,
      url,
      name,
      description,
    )
    ctx.status = 200
    ctx.body = teamSlackWebhook
  }

  public async delete(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const deletedId = await this.teamSlackWebhookService.delete(id)
    ctx.status = 200
    ctx.body = { id: deletedId }
  }
}
