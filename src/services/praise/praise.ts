import { Praise, PraiseQueryParams } from '~/domains/entities/praise'
import { PraiseLike } from '~/domains/entities/praiseLike'
import { PraiseUpVote } from '~/domains/entities/praiseUpVote'
import { User } from '~/domains/entities/user'
import { PraiseRepository } from '~/domains/repositories/praise'
import { UserRepository } from '~/domains/repositories/user'
import { ApplicationError, errorCode } from '~/services/errors/index'

export class PraiseService {
  private readonly praiseRepository: PraiseRepository
  private readonly userRepository: UserRepository

  public constructor(
    praiseRepository: PraiseRepository,
    userRepository: UserRepository,
  ) {
    this.praiseRepository = praiseRepository
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

  private async checkExistsPraise(praiseId: string): Promise<Praise> {
    const praise = await this.praiseRepository.getById(praiseId)

    if (!praise) {
      throw new ApplicationError(errorCode.NOT_FOUND, 'Praise is not found.', {
        id: praiseId,
      })
    }

    return praise
  }

  public async createPraise(
    from: string,
    to: string,
    message: string,
    tags: string[],
  ): Promise<Praise> {
    await this.checkExistsUser(from)
    await this.checkExistsUser(to)

    if (from === to) {
      throw new ApplicationError(
        errorCode.INVALID_PARAMETER,
        'Posting to yourself is not allowed.',
      )
    }

    const praise = new Praise({ from, to, message, tags })

    return await this.praiseRepository.create(praise)
  }

  public async listPraises(queryParams: PraiseQueryParams): Promise<Praise[]> {
    return await this.praiseRepository.getList(queryParams)
  }

  public async getPraise(id: string): Promise<Praise | undefined> {
    return await this.praiseRepository.getById(id)
  }

  public async updatePraise(
    id: string,
    from?: string,
    to?: string,
    message?: string,
    tags?: string[],
  ): Promise<Praise> {
    const praise = await this.checkExistsPraise(id)

    praise.update({ from, to, message, tags })

    return await this.praiseRepository.update(praise)
  }

  public async deletePraise(id: string): Promise<string> {
    await this.checkExistsPraise(id)

    return await this.praiseRepository.deleteById(id)
  }

  public async createPraiseLike(id: string, userId: string): Promise<Praise> {
    await this.checkExistsPraise(id)
    await this.checkExistsUser(userId)

    const praiseLike = new PraiseLike({ praiseId: id, userId })

    return await this.praiseRepository.createLike(praiseLike)
  }

  public async deletePraiseLike(id: string, userId: string): Promise<Praise> {
    await this.checkExistsPraise(id)
    await this.checkExistsUser(userId)

    const praiseLike = new PraiseLike({ praiseId: id, userId })

    return await this.praiseRepository.deleteLike(praiseLike)
  }

  public async createPraiseUpVote(id: string, userId: string): Promise<Praise> {
    await this.checkExistsPraise(id)
    await this.checkExistsUser(userId)

    const praiseUpVote = new PraiseUpVote({ praiseId: id, userId })

    return await this.praiseRepository.createUpVote(praiseUpVote)
  }

  public async deletePraiseUpVote(id: string, userId: string): Promise<Praise> {
    await this.checkExistsPraise(id)
    await this.checkExistsUser(userId)

    const praiseUpVote = new PraiseUpVote({ praiseId: id, userId })

    return await this.praiseRepository.deleteUpVote(praiseUpVote)
  }
}
