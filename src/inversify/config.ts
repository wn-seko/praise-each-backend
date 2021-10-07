import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { PraiseRepository } from '~/domains/repositories/praise'
import { UserRepository } from '~/domains/repositories/user'
import { UserCredentialRepository } from '~/domains/repositories/userCredential'
import { SQLPraiseRepository } from '~/infrastructures/repositories/praise'
import { SQLUserRepository } from '~/infrastructures/repositories/user'
import { SQLUserCredentialRepository } from '~/infrastructures/repositories/userCredential'
import { PraisePresenter } from '~/presenter/praise'
import { UserPresenter } from '~/presenter/user'
import { OAuthService } from '~/services/oauth'
import { PraiseService } from '~/services/praise'
import { UserService } from '~/services/user'

export const container = new Container()

// bind to SQL Impl
container.bind<PraiseRepository>(TYPES.PraiseRepository).to(SQLPraiseRepository)
container.bind<UserRepository>(TYPES.UserRepository).to(SQLUserRepository)
container
  .bind<UserCredentialRepository>(TYPES.UserCredentialRepository)
  .to(SQLUserCredentialRepository)

// resolve service injection
container.bind<OAuthService>(TYPES.OAuthService).to(OAuthService)
container.bind<PraiseService>(TYPES.PraiseService).to(PraiseService)
container.bind<UserService>(TYPES.UserService).to(UserService)

// resolve presenter injection
container.bind<PraisePresenter>(TYPES.PraisePresenter).to(PraisePresenter)
container.bind<UserPresenter>(TYPES.UserPresenter).to(UserPresenter)
