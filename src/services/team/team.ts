import { PaginationResponse } from '../base'
import { ApplicationError, errorCode } from '../errors'
import { Team } from '~/domains/entities/team'
import { User } from '~/domains/entities/user'
import { UserAffiliation } from '~/domains/entities/userAffiliations'
import { TeamRepository } from '~/domains/repositories/team'
import { UserRepository } from '~/domains/repositories/user'

export class TeamService {
  private readonly teamRepository: TeamRepository
  private readonly userRepository: UserRepository

  public constructor(
    teamRepository: TeamRepository,
    userRepository: UserRepository,
  ) {
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

  private async checkExistsUsers(userIds: string[]): Promise<User[]> {
    const users = await this.userRepository.getByIds(userIds)

    userIds.forEach((userId) => {
      if (!users.find((user) => user.id === userId)) {
        throw new ApplicationError(errorCode.NOT_FOUND, 'User is not found.', {
          id: userId,
        })
      }
    })

    return users
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

  public async createTeam(name: string, color: string): Promise<Team> {
    const team = new Team({ name, color })
    return await this.teamRepository.create(team)
  }

  public async listTeams(
    offset: number,
    limit: number,
  ): Promise<PaginationResponse<Team>> {
    const list = await this.teamRepository.getList(offset, limit)
    const count = await this.teamRepository.count('')
    return {
      list,
      pagination: {
        currentPage: offset + 1,
        limit,
        pages: count,
      },
    }
  }

  public async search(
    word: string,
    offset: number,
    limit: number,
  ): Promise<PaginationResponse<Team>> {
    const list = await this.teamRepository.search(word, offset, limit)
    const count = await this.teamRepository.count('')
    return {
      list,
      pagination: {
        currentPage: offset + 1,
        limit,
        pages: count,
      },
    }
  }

  public async getTeam(id: string): Promise<Team | undefined> {
    await this.checkExistsTeam(id)
    return await this.teamRepository.getById(id)
  }

  public async getByUserId(userId: string): Promise<Team[]> {
    await this.checkExistsUser(userId)

    const teams = await this.teamRepository.getByUserId(userId)
    return teams
  }

  public async updateTeam(
    id: string,
    name: string,
    color: string,
  ): Promise<Team> {
    const team = await this.checkExistsTeam(id)
    team.update({ name, color })
    return await this.teamRepository.update(team)
  }

  public async deleteTeam(id: string): Promise<string> {
    await this.checkExistsTeam(id)
    return await this.teamRepository.deleteById(id)
  }

  public async addUser(teamId: string, userId: string): Promise<Team> {
    await this.checkExistsTeam(teamId)
    await this.checkExistsUser(userId)

    const userAffiliation = new UserAffiliation({ teamId, userId })

    return await this.teamRepository.addUser(userAffiliation)
  }

  public async removeUser(teamId: string, userId: string): Promise<Team> {
    await this.checkExistsTeam(teamId)
    await this.checkExistsUser(userId)

    const userAffiliation = new UserAffiliation({ teamId, userId })

    return await this.teamRepository.removeUser(userAffiliation)
  }

  public async updateUsers(teamId: string, userIds: string[]): Promise<Team> {
    let team = await this.checkExistsTeam(teamId)
    await this.checkExistsUsers(userIds)

    const sub = (src: string[], target: string[]) =>
      src.filter((item) => !target.includes(item))

    const removeUserIds = sub(team.userIds, userIds)
    const addUserIds = sub(userIds, team.userIds)

    for (const userId of removeUserIds) {
      const userAffiliation = new UserAffiliation({ teamId, userId })
      team = await this.teamRepository.removeUser(userAffiliation)
    }

    for (const userId of addUserIds) {
      const userAffiliation = new UserAffiliation({ teamId, userId })
      team = await this.teamRepository.addUser(userAffiliation)
    }

    return team
  }
}
