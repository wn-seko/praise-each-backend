import dayjs from 'dayjs'
import { Praise, PraiseType } from '~/domains/entities/praise'
import { PraiseRepository } from '~/domains/repositories/praise'
import { knex } from '~/infrastructures/database'

const resultToPraise = (result: PraiseType): Praise => {
  return new Praise({
    ...result,
    createdAt: dayjs(result.createdAt),
    updatedAt: dayjs(result.updatedAt),
  })
}

export class SQLPraiseRepository implements PraiseRepository {
  async create(praise: Praise): Promise<Praise> {
    const results = await knex<PraiseType>('praises').insert(praise, '*')
    return resultToPraise(results[0])
  }

  async getById(id: string): Promise<Praise | undefined> {
    const result = await knex<PraiseType>('praises').where({ id }).first('*')
    return result ? resultToPraise(result) : undefined
  }

  async getList(): Promise<Praise[]> {
    const results = await knex<PraiseType>('praises').orderBy(
      'createdAt',
      'desc',
    )

    return results.map(resultToPraise)
  }

  async update(praise: PraiseType): Promise<Praise> {
    const results = await knex<PraiseType>('praises')
      .where('id', praise.id)
      .update(praise, '*')
    return resultToPraise(results[0])
  }

  async deleteById(id: string): Promise<string> {
    await knex<PraiseType>('praises').where({ id }).del<PraiseType>()
    return id
  }
}
