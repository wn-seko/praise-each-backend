import { Tag } from '~/domains/entities/tag'

export interface TagRepository {
  create(tag: Tag): Promise<Tag>
  getById(tagId: string): Promise<Tag | undefined>
  count(word: string): Promise<number>
  getList(offset: number, limit: number): Promise<Tag[]>
  search(word: string, offset: number, limit: number): Promise<Tag[]>
  delete(id: string): Promise<string>
}
