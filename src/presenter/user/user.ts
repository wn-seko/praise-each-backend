import { User, UserResponse } from '~/domains/entities/user'

export class UserPresenter {
  public usersToResponse(users: User[]): UserResponse[] {
    return users.map((user) => this.userToResponse(user))
  }

  public userToResponse(user: User): UserResponse {
    return Object.fromEntries(
      Object.entries(user.toJSON()).filter(([key]) => key !== 'snsId'),
    ) as UserResponse
  }
}
