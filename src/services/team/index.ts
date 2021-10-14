import { decorate, inject, injectable } from 'inversify'
import { TeamService } from './team'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.TeamRepository) as ClassDecorator, TeamService, 0)
decorate(inject(TYPES.UserRepository) as ClassDecorator, TeamService, 1)
decorate(injectable(), TeamService)

export { TeamService }
