import { Praise, PraiseQueryParams } from '~/domains/entities/praise'
import { PraiseLike } from '~/domains/entities/praiseLike'
import { PraiseUpVote } from '~/domains/entities/praiseUpVote'
import { Tag } from '~/domains/entities/tag'
import { Team } from '~/domains/entities/team'
import { User } from '~/domains/entities/user'
import { PraiseRepository } from '~/domains/repositories/praise'
import { TagRepository } from '~/domains/repositories/tag'
import { TeamRepository } from '~/domains/repositories/team'
import { TeamSlackWebhookRepository } from '~/domains/repositories/teamSlackWebhook'
import { UserRepository } from '~/domains/repositories/user'
import { env } from '~/env'
import { ApplicationError, errorCode } from '~/services/errors/index'
import { intersection } from '~/utils/collection'
import { postSlackWebhook } from '~/utils/webhook/slack'

export class PraiseService {
  private readonly praiseRepository: PraiseRepository
  private readonly userRepository: UserRepository
  private readonly teamRepository: TeamRepository
  private readonly tagRepository: TagRepository
  private readonly teamSlackWebhookRepository: TeamSlackWebhookRepository

  public constructor(
    praiseRepository: PraiseRepository,
    userRepository: UserRepository,
    teamRepository: TeamRepository,
    tagRepository: TagRepository,
    teamSlackWebhookRepository: TeamSlackWebhookRepository,
  ) {
    this.praiseRepository = praiseRepository
    this.userRepository = userRepository
    this.teamRepository = teamRepository
    this.tagRepository = tagRepository
    this.teamSlackWebhookRepository = teamSlackWebhookRepository
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
    const team = await this.teamRepository.getById(teamId)

    if (!team) {
      throw new ApplicationError(errorCode.NOT_FOUND, 'Team is not found.', {
        id: teamId,
      })
    }

    return team
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

  private async createTagIfNotExists(tags: string[]) {
    for (const tag of tags) {
      const sanitizedTag = tag.replace(/^#/, '')
      const tagCount = await this.tagRepository.count(sanitizedTag)
      if (!tagCount) {
        await this.tagRepository.create(new Tag({ name: sanitizedTag }))
      }
    }
  }

  private async postSlackWebhookFeed(from: User, to: User, message: string) {
    const fromUserTeam = await this.teamRepository.getByUserId(from.id)
    const toUserTeam = await this.teamRepository.getByUserId(to.id)

    const teams = intersection(
      fromUserTeam,
      toUserTeam,
      (team: Team) => team.id,
    )

    for (const team of teams) {
      const teamSlackWebhooks =
        await this.teamSlackWebhookRepository.getByTeamId(team.id)

      for (const teamSlackWebhook of teamSlackWebhooks) {
        try {
          const serviceLink = env.APPLICATION_URL
            ? `\n<${env.APPLICATION_URL}|PraiseEachを確認する>`
            : ''

          await postSlackWebhook(
            teamSlackWebhook.url,
            `${from.name} → ${to.name}\n${message}${serviceLink}`,
          )
        } catch (e) {
          // noop
        }
      }
    }
  }

  public async createPraise(
    from: string,
    to: string,
    message: string,
    tags: string[],
  ): Promise<Praise> {
    const fromUser = await this.checkExistsUser(from)
    const toUser = await this.checkExistsUser(to)

    if (from === to) {
      throw new ApplicationError(
        errorCode.INVALID_PARAMETER,
        'Posting to yourself is not allowed.',
      )
    }

    await this.createTagIfNotExists(tags)

    const praise = new Praise({ from, to, message, tags })

    await this.postSlackWebhookFeed(fromUser, toUser, message)

    return await this.praiseRepository.create(praise)
  }

  public async listPraises(
    queryParams: PraiseQueryParams & { teamId?: string },
  ): Promise<Praise[]> {
    const { teamId, ...options } = queryParams

    if (teamId) {
      const team = await this.checkExistsTeam(teamId)
      return await this.praiseRepository.getList({
        ...options,
        from: team.userIds,
        to: team.userIds,
      })
    }

    return await this.praiseRepository.getList(options)
  }

  public async getPraise(id: string): Promise<Praise | undefined> {
    return await this.praiseRepository.getById(id)
  }

  public async updatePraise(
    id: string,
    userId: string,
    message?: string,
    tags?: string[],
  ): Promise<Praise> {
    const praise = await this.checkExistsPraise(id)

    if (praise.from !== userId) {
      throw new ApplicationError(
        errorCode.INVALID_PARAMETER,
        'Method not allowed.',
      )
    }

    praise.update({ message, tags })

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
