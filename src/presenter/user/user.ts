import { TeamResponse } from '~/domains/entities/team'
import { User, UserResponse } from '~/domains/entities/user'
import { TeamRepository } from '~/domains/repositories/team'

interface MergedUserResponse extends UserResponse {
  teams: TeamResponse[]
}

export class UserPresenter {
  private readonly teamRepository: TeamRepository

  public constructor(teamRepository: TeamRepository) {
    this.teamRepository = teamRepository
  }

  private mergeTeam(
    user: User,
    teamHashMap: Record<string, TeamResponse>,
  ): MergedUserResponse {
    return {
      ...user.toJSON(),
      teams: user.teamIds.map((teamId) => teamHashMap[teamId]),
    }
  }

  private async createTeamHash(teamIds: string[]) {
    const teams = await this.teamRepository.getByIds(teamIds)
    return Object.fromEntries(teams.map((team) => [team.id, team.toJSON()]))
  }

  public async usersToResponse(users: User[]): Promise<MergedUserResponse[]> {
    const teamIds = Array.from(
      new Set([
        ...users.reduce(
          (memo, user) => memo.concat(user.teamIds),
          [] as string[],
        ),
      ]),
    )
    const userHash = await this.createTeamHash(teamIds)

    return users.map((user) => this.mergeTeam(user, userHash))
  }

  public async userToResponse(user: User): Promise<MergedUserResponse> {
    const teamIds = Array.from(new Set([...user.teamIds]))
    const userHash = await this.createTeamHash(teamIds)
    return this.mergeTeam(user, userHash)
  }
}
