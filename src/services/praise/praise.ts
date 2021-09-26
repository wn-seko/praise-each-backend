import { Praise } from '~/domains/entities/praise'
import { User } from '~/domains/entities/user'
import { PraiseRepository } from '~/domains/repositories/praise'
import { UserRepository } from '~/domains/repositories/user'
import { ApplicationError } from '~/services/errors'

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
      throw new ApplicationError(404, { code: 'user not found' })
    }

    return user
  }

  private async checkExistsPraise(praiseId: string): Promise<Praise> {
    const praise = await this.praiseRepository.getById(praiseId)

    if (!praise) {
      throw new ApplicationError(404, {
        code: `praise is not found. ID: ${praiseId}`,
      })
    }

    return praise
  }

  public async createPraise(
    from: string,
    to: string,
    message: string,
    tags: string[],
  ): Promise<string> {
    await this.checkExistsUser(from)
    await this.checkExistsUser(to)

    const praise = new Praise({ from, to, message, tags })

    return await this.praiseRepository.create(praise)
  }

  public async listPraises(): Promise<Praise[]> {
    return await this.praiseRepository.getList()
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
  ): Promise<string> {
    const praise = await this.checkExistsPraise(id)

    praise.update({ from, to, message, tags })

    return await this.praiseRepository.update(praise)
  }

  public async deletePraise(id: string): Promise<Praise> {
    await this.checkExistsPraise(id)

    return await this.praiseRepository.deleteById(id)
  }
}
