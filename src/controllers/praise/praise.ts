import Koa from 'koa'
import { PraiseService } from '~/services/praise'

export class PraiseController {
  private readonly praiseService: PraiseService

  public constructor(praiseService: PraiseService) {
    this.praiseService = praiseService
  }

  public async listPraises(ctx: Koa.Context): Promise<void> {
    const praises = await this.praiseService.listPraises()
    ctx.body = praises
  }

  public async getPraise(ctx: Koa.Context): Promise<void> {
    const praise = await this.praiseService.getPraise(ctx.params['id'])
    ctx.body = praise
  }

  public async createPraise(ctx: Koa.Context): Promise<void> {
    const { from, to, message, tags } = ctx.request.body
    const praise = await this.praiseService.createPraise(
      from || 'user-0000',
      to,
      message,
      tags,
    )
    ctx.status = 201
    ctx.body = praise
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
    ctx.body = praise
  }

  public async deletePraise(ctx: Koa.Context): Promise<void> {
    const { id } = ctx.params
    await this.praiseService.deletePraise(id)
    ctx.status = 200
  }
}
