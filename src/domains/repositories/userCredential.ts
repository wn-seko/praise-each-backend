import { UserCredential } from '~/domains/entities/userCredential'

export interface UserCredentialRepository {
  getByIdAndType(
    oauthId: string,
    type: string,
  ): Promise<UserCredential | undefined>
  create(userCredential: UserCredential): Promise<UserCredential>
  update(userCredential: UserCredential): Promise<UserCredential>
}
