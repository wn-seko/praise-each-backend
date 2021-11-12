import { ApplicationError, errorCode } from '../errors'
import { Team } from '~/domains/entities/team'
import { TeamPin } from '~/domains/entities/teamPin'
import { User } from '~/domains/entities/user'
import { TeamRepository } from '~/domains/repositories/team'
import { TeamPinRepository } from '~/domains/repositories/teamPin'
import { UserRepository } from '~/domains/repositories/user'

export class TeamPinService {
  private readonly teamPinRepository: TeamPinRepository
  private readonly teamRepository: TeamRepository
  private readonly userRepository: UserRepository

  public constructor(
    teamPinRepository: TeamPinRepository,
    teamRepository: TeamRepository,
    userRepository: UserRepository,
  ) {
    this.teamPinRepository = teamPinRepository
    this.teamRepository = teamRepository
    this.userRepository = userRepository
  }

  private async checkExistsUser(userId: string): Promise<User> {
    const user = await this.userRepository.getById(userId)

    if (!user) {
      throw new ApplicationError(errorCode.NOT_FOUND, 'User is not found.', {
        id: userId,
      })
    }

    return user
  }

  private async checkExistsTeam(teamId: string): Promise<Team> {
    const teamPin = await this.teamRepository.getById(teamId)

    if (!teamPin) {
      throw new ApplicationError(errorCode.NOT_FOUND, 'Team is not found.', {
        id: teamId,
      })
    }

    return teamPin
  }

  public async createTeamPin(userId: string, teamId: string): Promise<TeamPin> {
    const teamPin = new TeamPin({ userId, teamId })
    return await this.teamPinRepository.create(teamPin)
  }

  public async getTeamPinByUserId(userId: string): Promise<TeamPin[]> {
    await this.checkExistsUser(userId)
    return await this.teamPinRepository.getByUserId(userId)
  }

  public async deleteTeamPin(userId: string, teamId: string): Promise<void> {
    await this.checkExistsUser(userId)
    await this.checkExistsTeam(teamId)

    const teamPin = new TeamPin({ userId, teamId })
    await this.teamPinRepository.delete(teamPin)
  }
}
