import { decorate, injectable } from 'inversify'
import { SQLUserRepository } from './user'

decorate(injectable(), SQLUserRepository)

export { SQLUserRepository }
