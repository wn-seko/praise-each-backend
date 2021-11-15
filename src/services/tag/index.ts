import { decorate, inject, injectable } from 'inversify'
import { TagService } from './tag'
import { TYPES } from '~/inversify/types'

decorate(inject(TYPES.TagRepository) as ClassDecorator, TagService, 0)
decorate(injectable(), TagService)

export { TagService }
