import { ApplicationError, errorCode } from '../errors'
import { Team } from '~/domains/entities/team'
import { TeamSlackWebhook } from '~/domains/entities/teamSlackWebhook'
import { TeamRepository } from '~/domains/repositories/team'
import { TeamSlackWebhookRepository } from '~/domains/repositories/teamSlackWebhook'

export class TeamSlackWebhookService {
  private readonly teamSlackWebhookRepository: TeamSlackWebhookRepository
  private readonly teamRepository: TeamRepository

  public constructor(
    teamSlackWebhookRepository: TeamSlackWebhookRepository,
    teamRepository: TeamRepository,
  ) {
    this.teamSlackWebhookRepository = teamSlackWebhookRepository
    this.teamRepository = teamRepository
  }

  private async checkExistsTeam(teamId: string): Promise<Team> {
    const team = await this.teamRepository.getById(teamId)

    if (!team) {
      throw new ApplicationError(errorCode.NOT_FOUND, 'Team is not found.', {
        id: teamId,
      })
    }

    return team
  }

  private async checkExistsTeamSlackWebhook(
    id: string,
  ): Promise<TeamSlackWebhook> {
    const teamSlackWebhook = await this.teamSlackWebhookRepository.getById(id)

    if (!teamSlackWebhook) {
      throw new ApplicationError(
        errorCode.NOT_FOUND,
        'Slack webhook is not found.',
        {
          id,
        },
      )
    }

    return teamSlackWebhook
  }

  public async create(
    teamId: string,
    url: string,
    name: string,
    description: string,
  ): Promise<TeamSlackWebhook> {
    await this.checkExistsTeam(teamId)

    const teamSlackWebhook = new TeamSlackWebhook({
      teamId,
      url,
      name,
      description: description || '',
    })

    return await this.teamSlackWebhookRepository.create(teamSlackWebhook)
  }

  public async list(teamId: string): Promise<TeamSlackWebhook[]> {
    await this.checkExistsTeam(teamId)
    return await this.teamSlackWebhookRepository.getByTeamId(teamId)
  }

  public async update(
    id: string,
    url?: string,
    name?: string,
    description?: string,
  ): Promise<TeamSlackWebhook> {
    const teamSlackWebhook = await this.checkExistsTeamSlackWebhook(id)
    teamSlackWebhook.update({ url, name, description })
    return await this.teamSlackWebhookRepository.update(teamSlackWebhook)
  }

  public async delete(id: string): Promise<void> {
    const teamSlackWebhook = await this.checkExistsTeamSlackWebhook(id)
    await this.teamSlackWebhookRepository.delete(teamSlackWebhook)
  }
}
