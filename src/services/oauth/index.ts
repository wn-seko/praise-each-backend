import { decorate, inject, injectable } from 'inversify'
import { OAuthService } from './oauth'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.UserRepository) as ClassDecorator, OAuthService, 0)
decorate(
  inject(TYPES.UserCredentialRepository) as ClassDecorator,
  OAuthService,
  1,
)
decorate(injectable(), OAuthService)

export { OAuthService }
