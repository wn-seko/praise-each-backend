import { User } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'
import { knex } from '~/infrastructures/database'

export class SQLUserRepository implements UserRepository {
  async create(user: User): Promise<string> {
    return await knex<User>('users').insert(user)
  }

  async getById(id: string): Promise<User | undefined> {
    return await knex<User>('users').where({ id }).first('*')
  }

  async getList(): Promise<User[]> {
    return await knex<User>('users')
  }

  async update(user: User): Promise<string> {
    return await knex<User>('users').where('id', user.id).update(user)
  }

  async deleteById(id: string): Promise<User> {
    return await knex<User>('users').where({ id }).del<User>()
  }
}
