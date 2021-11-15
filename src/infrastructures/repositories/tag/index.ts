import { decorate, injectable } from 'inversify'
import { SQLTagRepository } from './tag'

decorate(injectable(), SQLTagRepository)

export { SQLTagRepository }
