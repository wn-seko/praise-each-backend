import { Team, TeamResponse } from '~/domains/entities/team'
import { UserResponse } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'

interface MergedTeamResponse extends TeamResponse {
  users: UserResponse[]
}

export class TeamPresenter {
  private readonly userRepository: UserRepository

  public constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  private mergeUser(
    team: Team,
    userHashMap: Record<string, UserResponse>,
  ): MergedTeamResponse {
    return {
      ...team.toJSON(),
      users: team.userIds.map((userId) => userHashMap[userId]),
    }
  }

  private async createUserHash(userIds: string[]) {
    const users = await this.userRepository.getByIds(userIds)
    return Object.fromEntries(users.map((user) => [user.id, user.toJSON()]))
  }

  public async teamsToResponse(teams: Team[]): Promise<TeamResponse[]> {
    const userIds = Array.from(
      new Set([
        ...teams.reduce(
          (memo, team) => memo.concat(team.userIds),
          [] as string[],
        ),
      ]),
    )
    const userHash = await this.createUserHash(userIds)

    return teams.map((team) => this.mergeUser(team, userHash))
  }

  public async teamToResponse(team: Team): Promise<TeamResponse> {
    const userIds = Array.from(new Set([...team.userIds]))
    const userHash = await this.createUserHash(userIds)
    return this.mergeUser(team, userHash)
  }
}
