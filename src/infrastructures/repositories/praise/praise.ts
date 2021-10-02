import dayjs from 'dayjs'
import { Praise, PraiseType } from '~/domains/entities/praise'
import { PraiseRepository } from '~/domains/repositories/praise'
import { knex } from '~/infrastructures/database'

interface DbPraiseProps {
  id: string
  from: string
  to: string
  message: string
  tags: string[]
  created_at: string
  updated_at: string
}

interface DbPraiseType extends DbPraiseProps {
  likes: string[]
  up_votes: string[]
}

const resultToPraise = (result: DbPraiseType): Praise => {
  return new Praise({
    ...result,
    likes: result.likes.filter((item) => !!item),
    upVotes: result.up_votes.filter((item) => !!item),
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const praiseToDbType = (praise: PraiseType): DbPraiseProps => ({
  id: praise.id,
  from: praise.from,
  to: praise.to,
  message: praise.message,
  tags: praise.tags,
  created_at: praise.createdAt.toISOString(),
  updated_at: praise.updatedAt.toISOString(),
})

export class SQLPraiseRepository implements PraiseRepository {
  async create(praise: Praise): Promise<Praise> {
    const results = await knex<DbPraiseType>('praises').insert(
      praiseToDbType(praise),
      '*',
    )
    return resultToPraise(results[0])
  }

  async getById(id: string): Promise<Praise | undefined> {
    const result = await knex<DbPraiseType>('praises').where({ id }).first('*')
    return result ? resultToPraise(result) : undefined
  }

  async getList(): Promise<Praise[]> {
    try {
      const subQuery = knex
        .select([
          'praises.*',
          knex.raw('ARRAY_AGG(praise_likes.user_id) as likes'),
        ])
        .from('praises')
        .leftJoin('praise_likes', 'praises.id', 'praise_likes.praise_id')
        .groupBy('praises.id')
        .as('t1')

      const results = await knex
        .select<DbPraiseType[]>([
          't1.*',
          knex.raw('ARRAY_AGG(praise_up_votes.user_id) as up_votes'),
        ])
        .from(subQuery)
        .leftJoin('praise_up_votes', 't1.id', 'praise_up_votes.praise_id')
        .groupBy(
          't1.id',
          't1.from',
          't1.to',
          't1.message',
          't1.tags',
          't1.likes',
          't1.created_at',
          't1.updated_at',
        )
        .orderBy('created_at', 'desc')

      return results.map(resultToPraise)
    } catch (e) {
      console.error(e)
      return new Promise((r) => r([]))
    }
  }

  async update(praise: PraiseType): Promise<Praise> {
    const results = await knex<DbPraiseType>('praises')
      .where('id', praise.id)
      .update(praise, '*')
    return resultToPraise(results[0])
  }

  async deleteById(id: string): Promise<string> {
    await knex<PraiseType>('praises').where({ id }).del<PraiseType>()
    return id
  }
}
