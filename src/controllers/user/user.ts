import Koa from 'koa'
import { UserService } from '~/services/user'

export class UserController {
  private readonly userService: UserService

  public constructor(userService: UserService) {
    this.userService = userService
  }

  public async listUsers(ctx: Koa.Context): Promise<void> {
    const { word } = ctx.query
    if (typeof word === 'string') {
      const users = await this.userService.search(word)
      ctx.body = users
    } else {
      const users = await this.userService.listUsers()
      ctx.body = users
    }
  }

  public async getUser(ctx: Koa.Context): Promise<void> {
    const user = await this.userService.getUser(ctx.params['id'])
    ctx.body = user
  }

  public async createUser(ctx: Koa.Context): Promise<void> {
    const { snsId, name, icon } = ctx.request.body
    this.userService.createUser(snsId, name, icon)
    ctx.status = 201
  }

  public async updateUser(ctx: Koa.Context): Promise<void> {
    const { id } = ctx.params
    const { name, icon } = ctx.request.body
    this.userService.updateUser(id, name, icon)
    ctx.status = 200
  }

  public async deleteUser(ctx: Koa.Context): Promise<void> {
    const { id } = ctx.params
    await this.userService.deleteUser(id)
    ctx.status = 200
  }
}
