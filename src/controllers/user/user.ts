import { CustomContext } from '~/middlewares/context'
import { UserPresenter } from '~/presenter/user'
import { UserService } from '~/services/user'
import { getJWT } from '~/utils/jwt'

export class UserController {
  private readonly userService: UserService
  private readonly userPresenter: UserPresenter

  public constructor(userService: UserService, userPresenter: UserPresenter) {
    this.userService = userService
    this.userPresenter = userPresenter
  }

  public async listUsers(ctx: CustomContext): Promise<void> {
    const { word } = ctx.request.query || {}

    if (typeof word === 'string') {
      const users = await this.userService.search(word)
      ctx.status = 200
      ctx.body = await this.userPresenter.usersToResponse(users)
    } else {
      const users = await this.userService.listUsers()
      ctx.status = 200
      ctx.body = await this.userPresenter.usersToResponse(users)
    }
  }

  public async getUser(ctx: CustomContext): Promise<void> {
    const user = await this.userService.getUser(ctx.params['id'])
    ctx.body = user ? await this.userPresenter.userToResponse(user) : null
  }

  public async updateUser(ctx: CustomContext): Promise<void> {
    const id = ctx.authUserId
    const { name, icon } = ctx.request.body
    const user = await this.userService.updateUser(id, name, icon)
    ctx.status = 200
    ctx.body = { token: getJWT(user) }
  }

  public async deleteUser(ctx: CustomContext): Promise<void> {
    const id = ctx.authUserId
    const deletedId = await this.userService.deleteUser(id)
    ctx.status = 200
    ctx.body = { id: deletedId }
  }
}
