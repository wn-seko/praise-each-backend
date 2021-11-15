import { CustomContext } from '~/middlewares/context'
import { TagService } from '~/services/tag'

export class TagController {
  private readonly tagService: TagService

  public constructor(tagService: TagService) {
    this.tagService = tagService
  }

  public async list(ctx: CustomContext): Promise<void> {
    const { word = '', page = 1, limit = 20 } = ctx.request.query || {}
    const sanitizedWord = typeof word === 'string' ? word : word[0]
    const sanitizedOffset = (Number(page) - 1) * Number(limit)
    const sanitizedLimit = Number(limit)
    const paginationTags = await this.tagService.list(
      sanitizedWord,
      sanitizedOffset,
      sanitizedLimit,
    )
    ctx.body = paginationTags
  }

  public async create(ctx: CustomContext): Promise<void> {
    const { name } = ctx.request.body || {}
    const tag = await this.tagService.create(name)
    ctx.status = 201
    ctx.body = tag
  }

  public async delete(ctx: CustomContext): Promise<void> {
    const { id } = ctx.params
    await this.tagService.delete(id)
    ctx.status = 200
  }
}
