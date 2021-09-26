import { decorate, inject, injectable } from 'inversify'
import { UserService } from './user'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.UserRepository) as ClassDecorator, UserService, 0)
decorate(injectable(), UserService)

export { UserService }
