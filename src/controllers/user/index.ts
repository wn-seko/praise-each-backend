import Router from '@koa/router'
import { UserController } from './user'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { UserPresenter } from '~/presenter/user'
import { UserService } from '~/services/user'

const userService = container.get<UserService>(TYPES.UserService)
const userPresenter = container.get<UserPresenter>(TYPES.UserPresenter)
const userController = new UserController(userService, userPresenter)

export const userRouter = new Router({ prefix: '/users' })

userRouter
  .get('/', userController.listUsers.bind(userController))
  .get('/:id', userController.getUser.bind(userController))
  .put('/me', userController.updateUser.bind(userController))
  .delete('/me', userController.deleteUser.bind(userController))
