import createError from 'http-errors'
import { User } from '~/domains/entities/user'
import { UserRepository } from '~/domains/repositories/user'

export class UserService {
  private readonly userRepository: UserRepository

  public constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  public async listUsers(): Promise<User[]> {
    return await this.userRepository.getList()
  }

  public async search(word: string): Promise<User[]> {
    if (!word) {
      return []
    }

    return await this.userRepository.search(word)
  }

  public async getUser(id: string): Promise<User | undefined> {
    return await this.userRepository.getById(id)
  }

  public async updateUser(
    id: string,
    name: string,
    icon: string,
  ): Promise<User> {
    const user = await this.userRepository.getById(id)

    if (!user) {
      throw createError(404, `user is not found. ID: ${id}`)
    }

    user.update({ name, icon })

    return await this.userRepository.update(user)
  }

  public async deleteUser(id: string): Promise<string> {
    return await this.userRepository.deleteById(id)
  }
}
