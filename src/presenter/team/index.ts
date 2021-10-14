import { decorate, inject, injectable } from 'inversify'
import { TeamPresenter } from './team'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.UserRepository) as ClassDecorator, TeamPresenter, 0)
decorate(injectable(), TeamPresenter)

export { TeamPresenter }
