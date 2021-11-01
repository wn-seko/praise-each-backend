import dayjs from 'dayjs'
import { User, UserType } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'
import { knex } from '~/infrastructures/database'

interface DbUserProps {
  id: string
  name: string
  icon: string
  is_deleted: boolean
  created_at: string
  updated_at: string
}

interface DbUserType extends DbUserProps {
  team_ids: string[]
}

const resultToUser = (result: DbUserType): User => {
  return new User({
    ...result,
    teamIds: (result.team_ids || []).filter((item) => !!item),
    isDeleted: !!result.is_deleted,
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const userToDbType = (user: User): DbUserProps => ({
  id: user.id,
  name: user.name,
  icon: user.icon,
  is_deleted: user.isDeleted,
  created_at: user.createdAt.toISOString(),
  updated_at: user.updatedAt.toISOString(),
})

const buildGetUsersQuery = (
  whereOptions: Record<string, unknown> = {},
  offset?: number,
  limit?: number,
) => {
  let baseQuery = knex.from('users')

  const { ids, name, ...options } = whereOptions

  baseQuery = ids ? baseQuery.whereIn('id', ids as string[]) : baseQuery
  baseQuery = name ? baseQuery.where('name', 'ilike', `%${name}%`) : baseQuery
  baseQuery = options ? baseQuery.where(options) : baseQuery
  baseQuery = baseQuery = baseQuery.as('u')

  let mainQuery = knex
    .select([
      'u.*',
      knex.raw('ARRAY_AGG(user_affiliations.team_id) as team_ids'),
    ])
    .from(baseQuery)
    .leftJoin('user_affiliations', 'u.id', 'user_affiliations.user_id')
    .groupBy(
      'u.id',
      'u.name',
      'u.icon',
      'u.is_deleted',
      'u.created_at',
      'u.updated_at',
      'user_affiliations.user_id',
    )
    .orderBy('u.created_at', 'desc')

  if (offset) {
    mainQuery = mainQuery.offset(offset)
  }

  if (limit) {
    mainQuery = mainQuery.limit(limit)
  }

  return mainQuery
}

export class SQLUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const results = await knex<DbUserProps>('users').insert(
      userToDbType(user),
      '*',
    )
    return resultToUser(results[0] as DbUserType)
  }

  async getById(id: string): Promise<User | undefined> {
    const result = await buildGetUsersQuery({ id }).first('*')
    return result ? resultToUser(result) : undefined
  }

  async getByIds(ids: string[]): Promise<User[]> {
    const results = await buildGetUsersQuery({ ids })
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
    const results = await buildGetUsersQuery()
    return results.map(resultToUser)
  }

  async search(word: string): Promise<User[]> {
    const results = await buildGetUsersQuery({ name: word })
    return results.map(resultToUser)
  }

  async update(user: User): Promise<User> {
    await knex<DbUserProps>('users')
      .where('id', user.id)
      .update(userToDbType(user), '*')

    return (await this.getById(user.id)) as User
  }

  async deleteById(id: string): Promise<string> {
    await knex<UserType>('users').where({ id }).del<User>()
    return id
  }
}
