import dayjs from 'dayjs'
import { TeamSlackWebhook } from '~/domains/entities/teamSlackWebhook'
import { TeamSlackWebhookRepository } from '~/domains/repositories/teamSlackWebhook'
import { knex } from '~/infrastructures/database'

interface DbTeamSlackWebhookProps {
  id: string
  team_id: string
  url: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

const resultToTeamSlackWebhook = (
  result: DbTeamSlackWebhookProps,
): TeamSlackWebhook => {
  return new TeamSlackWebhook({
    id: result.id,
    teamId: result.team_id,
    url: result.url,
    name: result.name,
    description: result.description,
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const teamSlackWebhookToDbType = (
  teamSlackWebhook: TeamSlackWebhook,
): DbTeamSlackWebhookProps => ({
  id: teamSlackWebhook.id,
  team_id: teamSlackWebhook.teamId,
  url: teamSlackWebhook.url,
  name: teamSlackWebhook.name,
  description: teamSlackWebhook.description,
  created_at: teamSlackWebhook.createdAt.toISOString(),
  updated_at: teamSlackWebhook.updatedAt.toISOString(),
})

export class SQLTeamSlackWebhookRepository
  implements TeamSlackWebhookRepository
{
  async getById(id: string): Promise<TeamSlackWebhook | undefined> {
    const result = await knex<DbTeamSlackWebhookProps>('team_slack_webhooks')
      .where({
        id,
      })
      .first()
    return result ? resultToTeamSlackWebhook(result) : undefined
  }

  async getByTeamId(teamId: string): Promise<TeamSlackWebhook[]> {
    const result = await knex<DbTeamSlackWebhookProps>(
      'team_slack_webhooks',
    ).where({
      team_id: teamId,
    })
    return result ? result.map(resultToTeamSlackWebhook) : []
  }

  async create(teamSlackWebhook: TeamSlackWebhook): Promise<TeamSlackWebhook> {
    const results = await knex<DbTeamSlackWebhookProps>(
      'team_slack_webhooks',
    ).insert(teamSlackWebhookToDbType(teamSlackWebhook), '*')
    return resultToTeamSlackWebhook(results[0])
  }

  async update(teamSlackWebhook: TeamSlackWebhook): Promise<TeamSlackWebhook> {
    await knex<DbTeamSlackWebhookProps>('team_slack_webhooks')
      .where('id', teamSlackWebhook.id)
      .update(teamSlackWebhookToDbType(teamSlackWebhook), '*')

    return (await this.getById(teamSlackWebhook.id)) as TeamSlackWebhook
  }

  async delete(teamSlackWebhook: TeamSlackWebhook): Promise<TeamSlackWebhook> {
    await knex<DbTeamSlackWebhookProps>('team_slack_webhooks')
      .where({
        id: teamSlackWebhook.id,
      })
      .delete()
    return teamSlackWebhook
  }
}
