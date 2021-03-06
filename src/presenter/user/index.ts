import { decorate, inject, injectable } from 'inversify'
import { UserPresenter } from './user'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.TeamRepository) as ClassDecorator, UserPresenter, 0)
decorate(injectable(), UserPresenter)

export { UserPresenter }
