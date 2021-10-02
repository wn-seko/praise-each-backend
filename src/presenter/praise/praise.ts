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
      likes: praise.likes.map((userId) => userHashMap[userId]),
      upVotes: praise.upVotes.map((userId) => userHashMap[userId]),
    }
  }

  public async praisesToResponse(praises: Praise[]): Promise<PraiseResponse[]> {
    const userIds = Array.from(
      new Set([
        ...praises.map((praise) => praise.from),
        ...praises.map((praise) => praise.to),
        ...praises.reduce(
          (memo, praise) => memo.concat(praise.likes),
          [] as string[],
        ),
        ...praises.reduce(
          (memo, praise) => memo.concat(praise.upVotes),
          [] as string[],
        ),
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
