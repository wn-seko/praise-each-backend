import { decorate, injectable } from 'inversify'
import { SQLPraiseRepository } from './praise'

decorate(injectable(), SQLPraiseRepository)

export { SQLPraiseRepository }
