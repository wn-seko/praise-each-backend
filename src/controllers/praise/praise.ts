import Koa from 'koa'
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

  public async listPraises(ctx: Koa.Context): Promise<void> {
    const praises = await this.praiseService.listPraises()
    ctx.body = await this.praisePresenter.praisesToResponse(praises)
  }

  public async getPraise(ctx: Koa.Context): Promise<void> {
    const praise = await this.praiseService.getPraise(ctx.params['id'])
    ctx.body = praise
      ? await this.praisePresenter.praiseToResponse(praise)
      : null
  }

  public async createPraise(ctx: Koa.Context): Promise<void> {
    const { from, to, message, tags } = ctx.request.body
    const praise = await this.praiseService.createPraise(
      from || '00000000-0000-0000-0000-000000000000',
      to,
      message,
      tags,
    )
    ctx.status = 201
    ctx.body = await this.praisePresenter.praiseToResponse(praise)
  }

  public async updatePraise(ctx: Koa.Context): Promise<void> {
    const { id } = ctx.params
    const { from, to, message, tags } = ctx.request.body
    const praise = await this.praiseService.updatePraise(
      id,
      from,
      to,
      message,
      tags,
    )
    ctx.status = 200
    ctx.body = await this.praisePresenter.praiseToResponse(praise)
  }

  public async deletePraise(ctx: Koa.Context): Promise<void> {
    const { id } = ctx.params
    await this.praiseService.deletePraise(id)
    ctx.status = 200
  }
}
