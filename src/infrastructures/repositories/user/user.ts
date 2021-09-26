import dayjs from 'dayjs'
import { User, UserType } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'
import { knex } from '~/infrastructures/database'

const resultToUser = (result: UserType): User => {
  return new User({
    ...result,
    createdAt: dayjs(result.createdAt),
    updatedAt: dayjs(result.updatedAt),
  })
}

export class SQLUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const results = await knex<UserType>('users').insert(user, '*')
    return resultToUser(results[0])
  }

  async getById(id: string): Promise<User | undefined> {
    const result = await knex<UserType>('users').where({ id }).first('*')
    return result ? resultToUser(result) : undefined
  }

  async getList(): Promise<User[]> {
    const results = await knex<UserType>('users')
    return results.map(resultToUser)
  }

  async search(word: string): Promise<User[]> {
    const results = await knex<UserType>('users').where(
      'name',
      'like',
      `%${word}%`,
    )
    return results.map(resultToUser)
  }

  async update(user: User): Promise<User> {
    return await knex<UserType>('users').where('id', user.id).update(user)
  }

  async deleteById(id: string): Promise<string> {
    await knex<UserType>('users').where({ id }).del<User>()
    return id
  }
}
