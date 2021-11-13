import dayjs from 'dayjs'
import { Tag, TagType } from '~/domains/entities/tag'
import { TagRepository } from '~/domains/repositories/tag'
import { knex } from '~/infrastructures/database'

interface DbTagProps {
  id: string
  name: string
  created_at: string
  updated_at: string
}

const resultToTag = (result: DbTagProps): Tag => {
  return new Tag({
    id: result.id,
    name: result.name,
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const tagToDbType = (tag: Tag): DbTagProps => ({
  id: tag.id,
  name: tag.name,
  created_at: tag.createdAt.toISOString(),
  updated_at: tag.updatedAt.toISOString(),
})

export class SQLTagRepository implements TagRepository {
  async create(tag: Tag): Promise<Tag> {
    const results = await knex<DbTagProps>('tags').insert(tagToDbType(tag), '*')
    return resultToTag(results[0] as DbTagProps)
  }

  async getById(tagId: string): Promise<Tag | undefined> {
    const result = await knex<DbTagProps>('tags').where({ id: tagId }).first()
    return result ? resultToTag(result) : undefined
  }

  async count(word: string): Promise<number> {
    let query = knex<number>('tags').count('*')
    query = word ? query.where('name', 'ilike', `%${word}%`) : query
    return await query.first('*')
  }

  async getList(offset: number, limit: number): Promise<Tag[]> {
    const results = await knex<DbTagProps>('team_pins')
      .offset(offset)
      .limit(limit)
    return results.map(resultToTag)
  }

  async search(word: string, offset: number, limit: number): Promise<Tag[]> {
    const results = await knex<DbTagProps>('tags')
      .where('name', 'ilike', `%${word}%`)
      .offset(offset)
      .limit(limit)
    return results.map(resultToTag)
  }

  async delete(id: string): Promise<string> {
    await knex<TagType>('tags').where({ id }).del<Tag>()
    return id
  }
}
