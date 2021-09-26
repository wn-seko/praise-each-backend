import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { SystemInfo } from '~/utils/types'
import {
  checkMaxLength,
  checkMinLength,
  checkValidUuidFormat,
} from '../validator'

interface Props {
  from: string
  to: string
  message: string
  tags: string[]
}

export type PraiseType = Props & SystemInfo

export class Praise {
  public readonly id: string
  public from: string
  public to: string
  public message: string
  public tags: string[]
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(praise: PraiseType | Props) {
    this.id = 'id' in praise ? this.checkId(praise.id) : uuid()
    this.from = this.checkUserId(praise.from)
    this.to = this.checkUserId(praise.to)
    this.message = this.checkMessage(praise.message)
    this.tags = this.checkTags(praise.tags)
    this.createdAt = 'createdAt' in praise ? praise.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  private checkId(value: string): string {
    checkValidUuidFormat(value)
    return value
  }

  private checkUserId(value: string): string {
    checkValidUuidFormat(value)
    return value
  }

  private checkMessage(value: string): string {
    checkMinLength(value, 1)
    checkMaxLength(value, 1000)
    return value
  }

  private checkTags(values: string[]): string[] {
    values.forEach((value) => {
      checkMinLength(value, 1)
      checkMaxLength(value, 100)
    })
    return values
  }

  public update(props: Partial<Props>) {
    this.from = props.from ??= this.from
    this.to = props.to ??= this.to
    this.message = props.message ??= this.message
    this.tags = props.tags ??= this.tags
    this.updatedAt = dayjs()
  }

  public toJSON() {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      message: this.message,
      tags: this.tags,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
