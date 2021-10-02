import dayjs, { Dayjs } from 'dayjs'
import { User, UserType } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'
import { knex } from '~/infrastructures/database'

interface DbUserResult {
  id: string
  sns_id: string
  name: string
  icon: string
  createdAt: Dayjs
  updatedAt: Dayjs
}

const resultToUser = (result: DbUserResult): User => {
  return new User({
    ...result,
    snsId: result.sns_id,
    createdAt: dayjs(result.createdAt),
    updatedAt: dayjs(result.updatedAt),
  })
}

export class SQLUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const results = await knex<DbUserResult>('users').insert(user, '*')
    return resultToUser(results[0])
  }

  async getById(id: string): Promise<User | undefined> {
    const result = await knex<DbUserResult>('users').where({ id }).first('*')
    return result ? resultToUser(result) : undefined
  }

  async getByIds(ids: string[]): Promise<User[]> {
    const results = await knex<DbUserResult>('users').whereIn('id', ids)
    return results.map(resultToUser)
  }

  async getList(): Promise<User[]> {
    const results = await knex<DbUserResult>('users')
    return results.map(resultToUser)
  }

  async search(word: string): Promise<User[]> {
    const results = await knex<DbUserResult>('users').where(
      'name',
      'ilike',
      `%${word}%`,
    )
    return results.map(resultToUser)
  }

  async update(user: User): Promise<User> {
    const result = await knex<DbUserResult>('users')
      .where('id', user.id)
      .update(user, '*')
    return resultToUser(result[0])
  }

  async deleteById(id: string): Promise<string> {
    await knex<UserType>('users').where({ id }).del<User>()
    return id
  }
}
