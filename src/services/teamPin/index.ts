import { decorate, inject, injectable } from 'inversify'
import { TeamPinService } from './teamPin'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.TeamPinRepository) as ClassDecorator, TeamPinService, 0)
decorate(inject(TYPES.TeamRepository) as ClassDecorator, TeamPinService, 1)
decorate(inject(TYPES.UserRepository) as ClassDecorator, TeamPinService, 2)
decorate(injectable(), TeamPinService)

export { TeamPinService }
