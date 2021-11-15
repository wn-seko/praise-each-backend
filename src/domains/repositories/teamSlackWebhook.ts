import { TeamSlackWebhook } from '~/domains/entities/teamSlackWebhook'

export interface TeamSlackWebhookRepository {
  getById(id: string): Promise<TeamSlackWebhook | undefined>
  getByTeamId(teamId: string): Promise<TeamSlackWebhook[]>
  create(teamSlackWebhook: TeamSlackWebhook): Promise<TeamSlackWebhook>
  update(teamSlackWebhook: TeamSlackWebhook): Promise<TeamSlackWebhook>
  delete(teamSlackWebhook: TeamSlackWebhook): Promise<TeamSlackWebhook>
}
