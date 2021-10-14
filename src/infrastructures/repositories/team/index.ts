import { decorate, injectable } from 'inversify'
import { SQLTeamRepository } from './team'

decorate(injectable(), SQLTeamRepository)

export { SQLTeamRepository }
