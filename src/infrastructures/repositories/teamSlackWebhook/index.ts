import { decorate, injectable } from 'inversify'
import { SQLTeamSlackWebhookRepository } from './teamSlackWebhook'

decorate(injectable(), SQLTeamSlackWebhookRepository)

export { SQLTeamSlackWebhookRepository }
