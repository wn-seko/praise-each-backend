import { decorate, injectable } from 'inversify'
import { SQLTeamPinRepository } from './teamPin'

decorate(injectable(), SQLTeamPinRepository)

export { SQLTeamPinRepository }
