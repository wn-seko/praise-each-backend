import dayjs from 'dayjs'
import { User, UserType } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'
import { knex } from '~/infrastructures/database'

interface DbUserProps {
  id: string
  name: string
  icon: string
  created_at: string
  updated_at: string
}

const resultToUser = (result: DbUserProps): User => {
  return new User({
    ...result,
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const userToDbType = (user: User): DbUserProps => ({
  id: user.id,
  name: user.name,
  icon: user.icon,
  created_at: user.createdAt.toISOString(),
  updated_at: user.updatedAt.toISOString(),
})

export class SQLUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const results = await knex<DbUserProps>('users').insert(
      userToDbType(user),
      '*',
    )
    return resultToUser(results[0])
  }

  async getById(id: string): Promise<User | undefined> {
    const result = await knex<DbUserProps>('users').where({ id }).first('*')
    return result ? resultToUser(result) : undefined
  }

  async getByIds(ids: string[]): Promise<User[]> {
    const results = await knex<DbUserProps>('users').whereIn('id', ids)
    return results.map(resultToUser)
  }

  async getByOAuth(
    oauthId: string,
    oauthType: string,
  ): Promise<User | undefined> {
    const result = await knex<DbUserProps>()
      .from('users')
      .where({ oauth_id: oauthId, oauth_type: oauthType })
      .innerJoin('user_credentials', 'user_credentials.user_id', 'users.id')
      .first('users.*')
    return result ? resultToUser(result) : undefined
  }

  async getList(): Promise<User[]> {
    const results = await knex<DbUserProps>('users')
    return results.map(resultToUser)
  }

  async search(word: string): Promise<User[]> {
    const results = await knex<DbUserProps>('users').where(
      'name',
      'ilike',
      `%${word}%`,
    )
    return results.map(resultToUser)
  }

  async update(user: User): Promise<User> {
    const result = await knex<DbUserProps>('users')
      .where('id', user.id)
      .update(userToDbType(user), '*')
    return resultToUser(result[0])
  }

  async deleteById(id: string): Promise<string> {
    await knex<UserType>('users').where({ id }).del<User>()
    return id
  }
}
