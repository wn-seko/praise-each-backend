import { decorate, inject, injectable } from 'inversify'
import { PraisePresenter } from './praise'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.UserRepository) as ClassDecorator, PraisePresenter, 0)
decorate(injectable(), PraisePresenter)

export { PraisePresenter }
