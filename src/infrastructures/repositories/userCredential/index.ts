import { decorate, injectable } from 'inversify'
import { SQLUserCredentialRepository } from './userCredential'

decorate(injectable(), SQLUserCredentialRepository)

export { SQLUserCredentialRepository }
