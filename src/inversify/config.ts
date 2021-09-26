import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { PraiseRepository } from '~/domains/repositories/praise'
import { UserRepository } from '~/domains/repositories/user'
import { SQLPraiseRepository } from '~/infrastructures/repositories/praise'
import { SQLUserRepository } from '~/infrastructures/repositories/user'
import { PraiseService } from '~/services/praise'
import { UserService } from '~/services/user'

export const container = new Container()

// bind to SQL Impl
container.bind<PraiseRepository>(TYPES.PraiseRepository).to(SQLPraiseRepository)
container.bind<UserRepository>(TYPES.UserRepository).to(SQLUserRepository)

// resolve injection
container.bind<PraiseService>(TYPES.PraiseService).to(PraiseService)
container.bind<UserService>(TYPES.UserService).to(UserService)
