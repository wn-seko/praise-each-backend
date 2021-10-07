import { CustomContext } from '~/middlewares/context'
import { PraisePresenter } from '~/presenter/praise'
import { PraiseService } from '~/services/praise'

export class PraiseController {
  private readonly praiseService: PraiseService
  private readonly praisePresenter: PraisePresenter

  public constructor(
    praiseService: PraiseService,
    praisePresenter: PraisePresenter,
  ) {
    this.praiseService = praiseService
    this.praisePresenter = praisePresenter
  }

  public async listPraises(ctx: CustomContext): Promise<void> {
    const { from, to, offset = 0, limit = 20 } = ctx.request.query || {}
    const praises = await this.praiseService.listPraises({
      from: typeof from === 'object' ? from[0] : from,
      to: typeof to === 'object' ? to[0] : to,
      offset: Number(offset),
      limit: Number(limit),
    })
    ctx.body = await this.praisePresenter.praisesToResponse(praises)
  }

  public async getPraise(ctx: CustomContext): Promise<void> {
    const praise = await this.praiseService.getPraise(ctx.params['id'])
    ctx.body = praise
      ? await this.praisePresenter.praiseToResponse(praise)
      : null
  }

  public async createPraise(ctx: CustomContext): Promise<void> {
    const { to, message, tags } = ctx.request.body || {}
    const userId = ctx.authUserId
    const praise = await this.praiseService.createPraise(
      userId,
      to,
      message,
      tags,
    )
    ctx.status = 201
    ctx.body = await this.praisePresenter.praiseToResponse(praise)
  }

  public async updatePraise(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const { to, message, tags } = ctx.request.body || {}
    const userId = ctx.authUserId
    const praise = await this.praiseService.updatePraise(
      id,
      userId,
      to,
      message,
      tags,
    )
    ctx.status = 200
    ctx.body = await this.praisePresenter.praiseToResponse(praise)
  }

  public async deletePraise(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    await this.praiseService.deletePraise(id)
    ctx.status = 200
  }

  public async createPraiseLike(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const userId = ctx.authUserId
    const praise = await this.praiseService.createPraiseLike(id, userId)

    ctx.body = praise
      ? await this.praisePresenter.praiseToResponse(praise)
      : null
  }

  public async deletePraiseLike(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const userId = ctx.authUserId
    const praise = await this.praiseService.deletePraiseLike(id, userId)

    ctx.body = praise
      ? await this.praisePresenter.praiseToResponse(praise)
      : null
  }

  public async createPraiseUpVote(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const userId = ctx.authUserId
    const praise = await this.praiseService.createPraiseUpVote(id, userId)

    ctx.body = praise
      ? await this.praisePresenter.praiseToResponse(praise)
      : null
  }

  public async deletePraiseUpVote(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    const userId = ctx.authUserId
    const praise = await this.praiseService.deletePraiseUpVote(id, userId)

    ctx.body = praise
      ? await this.praisePresenter.praiseToResponse(praise)
      : null
  }
}
