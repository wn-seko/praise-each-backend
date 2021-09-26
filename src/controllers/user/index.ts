import Router from '@koa/router'
import { UserController } from './user'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { UserService } from '~/services/user'

const userService = container.get<UserService>(TYPES.UserService)
const userController = new UserController(userService)

export const userRouter = new Router({ prefix: '/users' })

userRouter
  .get('/', userController.listUsers.bind(userController))
  .get('/:id', userController.getUser.bind(userController))
  .post('/', userController.createUser.bind(userController))
  .put('/:id', userController.updateUser.bind(userController))
  .delete('/:id', userController.deleteUser.bind(userController))
