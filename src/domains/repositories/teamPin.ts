import { TeamPin } from '~/domains/entities/teamPin'

export interface TeamPinRepository {
  getByUserId(userId: string): Promise<TeamPin[]>
  create(teamPin: TeamPin): Promise<TeamPin>
  delete(teamPin: TeamPin): Promise<TeamPin>
}
