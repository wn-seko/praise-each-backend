import { PaginationResponse } from '../base'
import { ApplicationError, errorCode } from '../errors'
import { Tag } from '~/domains/entities/tag'
import { TagRepository } from '~/domains/repositories/tag'

export class TagService {
  private readonly tagRepository: TagRepository

  public constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository
  }

  private getPagination(offset: number, limit: number, count: number) {
    const currentPage = offset + 1
    const pages = Math.ceil(count / limit)
    return { currentPage, limit, pages }
  }

  public async create(name: string): Promise<Tag> {
    const tagCount = await this.tagRepository.count(name)

    if (tagCount > 0) {
      throw new ApplicationError(
        errorCode.NOT_FOUND,
        'Tag is already exists.',
        {
          name,
        },
      )
    }

    const tag = new Tag({ name })
    return await this.tagRepository.create(tag)
  }

  public async list(
    word: string,
    offset: number,
    limit: number,
  ): Promise<PaginationResponse<Tag>> {
    const count = await this.tagRepository.count(word)
    const tags = word
      ? await this.tagRepository.search(word, offset, limit)
      : await this.tagRepository.getList(offset, limit)

    return {
      list: tags,
      pagination: this.getPagination(offset, limit, count),
    }
  }

  public async delete(tagId: string): Promise<void> {
    const tag = this.tagRepository.getById(tagId)

    if (!tag) {
      throw new ApplicationError(errorCode.NOT_FOUND, 'Tag is not found.', {
        id: tagId,
      })
    }

    await this.tagRepository.delete(tagId)
  }
}
