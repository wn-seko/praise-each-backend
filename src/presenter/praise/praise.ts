import { Praise, PraiseResponse } from '~/domains/entities/praise'
import { UserResponse } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'

export class PraisePresenter {
  private readonly userRepository: UserRepository

  public constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  private mergeUser(
    praise: Praise,
    userHashMap: Record<string, UserResponse>,
  ): PraiseResponse {
    return {
      ...praise.toJSON(),
      from: userHashMap[praise.from],
      to: userHashMap[praise.to],
    }
  }

  public async praisesToResponse(praises: Praise[]): Promise<PraiseResponse[]> {
    const userIds = Array.from(
      new Set([
        ...praises.map((praise) => praise.from),
        ...praises.map((praise) => praise.to),
      ]),
    )

    const users = await this.userRepository.getByIds(userIds)
    const userHash = Object.fromEntries(
      users.map((user) => [user.id, user.toJSON()]),
    )
    return praises.map((praise) => this.mergeUser(praise, userHash))
  }

  public async praiseToResponse(praise: Praise): Promise<PraiseResponse> {
    const userIds = Array.from(new Set([praise.from, praise.to]))

    const users = await this.userRepository.getByIds(userIds)
    const userHash = Object.fromEntries(
      users.map((user) => [user.id, user.toJSON()]),
    )
    return this.mergeUser(praise, userHash)
  }
}
