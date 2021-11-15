import 'reflect-metadata'
import { Container } from 'inversify'
import { TYPES } from './types'
import { PraiseRepository } from '~/domains/repositories/praise'
import { TagRepository } from '~/domains/repositories/tag'
import { TeamRepository } from '~/domains/repositories/team'
import { TeamPinRepository } from '~/domains/repositories/teamPin'
import { UserRepository } from '~/domains/repositories/user'
import { UserCredentialRepository } from '~/domains/repositories/userCredential'
import { SQLPraiseRepository } from '~/infrastructures/repositories/praise'
import { SQLTagRepository } from '~/infrastructures/repositories/tag'
import { SQLTeamRepository } from '~/infrastructures/repositories/team'
import { SQLTeamPinRepository } from '~/infrastructures/repositories/teamPin'
import { SQLUserRepository } from '~/infrastructures/repositories/user'
import { SQLUserCredentialRepository } from '~/infrastructures/repositories/userCredential'
import { PraisePresenter } from '~/presenter/praise'
import { TeamPresenter } from '~/presenter/team'
import { UserPresenter } from '~/presenter/user'
import { OAuthService } from '~/services/oauth'
import { PraiseService } from '~/services/praise'
import { TagService } from '~/services/tag'
import { TeamService } from '~/services/team'
import { TeamPinService } from '~/services/teamPin'
import { UserService } from '~/services/user'

export const container = new Container()

// bind to SQL Impl
container.bind<PraiseRepository>(TYPES.PraiseRepository).to(SQLPraiseRepository)
container.bind<UserRepository>(TYPES.UserRepository).to(SQLUserRepository)
container
  .bind<UserCredentialRepository>(TYPES.UserCredentialRepository)
  .to(SQLUserCredentialRepository)
container.bind<TeamRepository>(TYPES.TeamRepository).to(SQLTeamRepository)
container
  .bind<TeamPinRepository>(TYPES.TeamPinRepository)
  .to(SQLTeamPinRepository)
container.bind<TagRepository>(TYPES.TagRepository).to(SQLTagRepository)

// resolve service injection
container.bind<OAuthService>(TYPES.OAuthService).to(OAuthService)
container.bind<PraiseService>(TYPES.PraiseService).to(PraiseService)
container.bind<UserService>(TYPES.UserService).to(UserService)
container.bind<TeamService>(TYPES.TeamService).to(TeamService)
container.bind<TeamPinService>(TYPES.TeamPinService).to(TeamPinService)
container.bind<TagService>(TYPES.TagService).to(TagService)

// resolve presenter injection
container.bind<PraisePresenter>(TYPES.PraisePresenter).to(PraisePresenter)
container.bind<UserPresenter>(TYPES.UserPresenter).to(UserPresenter)
container.bind<TeamPresenter>(TYPES.TeamPresenter).to(TeamPresenter)
