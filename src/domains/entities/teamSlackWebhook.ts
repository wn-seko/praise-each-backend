import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import {
  checkMaxLength,
  checkMinLength,
  checkNoWhiteSpace,
  checkUrl,
  checkValidUuidFormat,
} from '../validator'
import { SystemInfo } from '~/utils/types'

interface Props {
  teamId: string
  url: string
  name: string
  description: string
}

export type TeamSlackWebhookType = Props & SystemInfo

export type TeamSlackWebhookResponse = Omit<
  TeamSlackWebhookType,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export class TeamSlackWebhook {
  public readonly id: string
  public readonly teamId: string
  public url: string
  public name: string
  public description: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(webhook: TeamSlackWebhookType | Props) {
    this.id = 'id' in webhook ? this.checkId(webhook.id) : uuid()
    this.teamId = this.checkId(webhook.teamId)
    this.url = this.checkWebhookUrl(webhook.url)
    this.name = this.checkName(webhook.name)
    this.description = this.checkDescription(webhook.description)
    this.createdAt = 'createdAt' in webhook ? webhook.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  private checkId(value: string): string {
    checkValidUuidFormat(value)
    return value
  }

  private checkName(value: string): string {
    checkMinLength(value, 1)
    checkMaxLength(value, 100)
    checkNoWhiteSpace(value)
    return value
  }

  private checkDescription(value: string): string {
    checkMinLength(value, 1)
    checkMaxLength(value, 100)
    return value
  }

  private checkWebhookUrl(value: string): string {
    checkUrl(value)
    return value
  }

  public update(props: Partial<Props>) {
    this.name = props.name ? this.checkName(props.name) : this.name
    this.description = props.description
      ? this.checkDescription(props.description)
      : this.description
    this.url = props.url ? this.checkWebhookUrl(props.url) : this.url
    this.updatedAt = dayjs()
  }

  public toJSON(): TeamSlackWebhookResponse {
    return {
      id: this.id,
      teamId: this.teamId,
      url: this.url,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
