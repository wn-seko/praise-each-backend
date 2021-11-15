import { decorate, inject, injectable } from 'inversify'
import { PraiseService } from './praise'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.PraiseRepository) as ClassDecorator, PraiseService, 0)
decorate(inject(TYPES.UserRepository) as ClassDecorator, PraiseService, 1)
decorate(inject(TYPES.TeamRepository) as ClassDecorator, PraiseService, 2)
decorate(inject(TYPES.TagRepository) as ClassDecorator, PraiseService, 3)
decorate(injectable(), PraiseService)

export { PraiseService }
