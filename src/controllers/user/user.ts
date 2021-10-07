import Koa from 'koa'
import { UserPresenter } from '~/presenter/user'
import { UserService } from '~/services/user'

export class UserController {
  private readonly userService: UserService
  private readonly userPresenter: UserPresenter

  public constructor(userService: UserService, userPresenter: UserPresenter) {
    this.userService = userService
    this.userPresenter = userPresenter
  }

  public async listUsers(ctx: Koa.Context): Promise<void> {
    const { word } = ctx.query
    if (typeof word === 'string') {
      const users = await this.userService.search(word)
      ctx.status = 200
      ctx.body = this.userPresenter.usersToResponse(users)
    } else {
      const users = await this.userService.listUsers()
      ctx.status = 200
      ctx.body = this.userPresenter.usersToResponse(users)
    }
  }

  public async getUser(ctx: Koa.Context): Promise<void> {
    const user = await this.userService.getUser(ctx.params['id'])
    ctx.body = user ? this.userPresenter.userToResponse(user) : null
  }

  public async updateUser(ctx: Koa.Context): Promise<void> {
    const { id } = ctx.params
    const { name, icon } = ctx.request.body
    const user = await this.userService.updateUser(id, name, icon)
    ctx.status = 200
    ctx.body = user ? this.userPresenter.userToResponse(user) : null
  }

  public async deleteUser(ctx: Koa.Context): Promise<void> {
    const { id } = ctx.params
    const deletedId = await this.userService.deleteUser(id)
    ctx.status = 200
    ctx.body = { id: deletedId }
  }
}
