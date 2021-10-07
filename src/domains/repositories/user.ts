import { User } from '~/domains/entities/user'

export interface UserRepository {
  create(user: User): Promise<User>
  getById(id: string): Promise<User | undefined>
  getByIds(ids: string[]): Promise<User[]>
  getByOAuth(oauthId: string, oauthType: string): Promise<User | undefined>
  getList(): Promise<User[]>
  search(word: string): Promise<User[]>
  update(user: User): Promise<User>
  deleteById(id: string): Promise<string>
}
