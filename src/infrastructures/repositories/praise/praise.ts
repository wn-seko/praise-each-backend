import { Praise } from '~/domains/entities/praise'
import { PraiseRepository } from '~/domains/repositories/praise'
import { knex } from '~/infrastructures/database'

export class SQLPraiseRepository implements PraiseRepository {
  async create(praise: Praise): Promise<string> {
    return await knex<Praise>('praises').insert(praise)
  }

  async getById(id: string): Promise<Praise | undefined> {
    return await knex<Praise>('praises').where({ id }).first('*')
  }

  async getList(): Promise<Praise[]> {
    return await knex<Praise>('praises')
  }

  async update(praise: Praise): Promise<string> {
    return await knex<Praise>('praises').where('id', praise.id).update(praise)
  }

  async deleteById(id: string): Promise<Praise> {
    return await knex<Praise>('praises').where({ id }).del<Praise>()
  }
}
