import { User } from '~/domains/entities/user'

export interface UserRepository {
  create(praise: User): Promise<string>
  getById(id: string): Promise<User | undefined>
  getList(): Promise<User[]>
  update(praise: User): Promise<string>
  deleteById(id: string): Promise<User>
}
