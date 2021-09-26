import { UserController } from './user'
import { container } from '~/inversify/config'
import { TYPES } from '~/inversify/types'
import { UserService } from '~/services/user'

const userService = container.get<UserService>(TYPES.UserService)
const userController = new UserController(userService)

export const listUsers = userController.listUsers.bind(userController)
export const getUser = userController.getUser.bind(userController)
export const createUser = userController.createUser.bind(userController)
export const updateUser = userController.updateUser.bind(userController)
export const deleteUser = userController.deleteUser.bind(userController)
