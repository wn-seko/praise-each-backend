import dayjs from 'dayjs'
import { UserCredential } from '~/domains/entities/userCredential'
import { UserCredentialRepository } from '~/domains/repositories/userCredential'
import { knex } from '~/infrastructures/database'

interface DbUserCredentialProps {
  user_id: string
  oauth_id: string
  oauth_type: string
  created_at: string
  updated_at: string
}

const resultToUserCredential = (
  result: DbUserCredentialProps,
): UserCredential => {
  return new UserCredential({
    userId: result.user_id,
    oauthId: result.oauth_id,
    oauthType: result.oauth_type as 'github',
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const userCredentialToDbType = (
  userCredential: UserCredential,
): DbUserCredentialProps => ({
  user_id: userCredential.userId,
  oauth_id: userCredential.oauthId,
  oauth_type: userCredential.oauthType,
  created_at: userCredential.createdAt.toISOString(),
  updated_at: userCredential.updatedAt.toISOString(),
})

export class SQLUserCredentialRepository implements UserCredentialRepository {
  async getByIdAndType(
    oauthId: string,
    oauthType: string,
  ): Promise<UserCredential | undefined> {
    const result = await knex<DbUserCredentialProps>('user_credentials')
      .where({ oauth_id: oauthId, oauth_type: oauthType })
      .first('*')
    return result ? resultToUserCredential(result) : undefined
  }

  async create(userCredential: UserCredential): Promise<UserCredential> {
    const results = await knex<DbUserCredentialProps>(
      'user_credentials',
    ).insert(userCredentialToDbType(userCredential), '*')
    return resultToUserCredential(results[0])
  }

  async update(userCredential: UserCredential): Promise<UserCredential> {
    const result = await knex<DbUserCredentialProps>('user_credentials')
      .where({ user_id: userCredential.userId })
      .update(userCredentialToDbType(userCredential), '*')
    return resultToUserCredential(result[0])
  }
}
