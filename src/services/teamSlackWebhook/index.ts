import { decorate, inject, injectable } from 'inversify'
import { TeamSlackWebhookService } from './teamSlackWebhook'
import { TYPES } from '~/inversify/types'

decorate(
  inject(TYPES.TeamSlackWebhookRepository) as ClassDecorator,
  TeamSlackWebhookService,
  0,
)
decorate(
  inject(TYPES.TeamRepository) as ClassDecorator,
  TeamSlackWebhookService,
  1,
)
decorate(injectable(), TeamSlackWebhookService)

export { TeamSlackWebhookService }
