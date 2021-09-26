import { User } from '~/domains/entities/user'

export interface UserRepository {
  create(praise: User): Promise<User>
  getById(id: string): Promise<User | undefined>
  getByIds(ids: string[]): Promise<User[]>
  getList(): Promise<User[]>
  search(word: string): Promise<User[]>
  update(praise: User): Promise<User>
  deleteById(id: string): Promise<string>
}
