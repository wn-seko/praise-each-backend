import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { SystemInfo } from '~/utils/types'
import {
  checkMaxLength,
  checkMinLength,
  checkValidUuidFormat,
} from '../validator'
import { UserResponse } from './user'

interface Props {
  from: string
  to: string
  message: string
  tags: string[]
}

interface ReadonlyProps extends SystemInfo {
  likes: string[]
  upVotes: string[]
}

export type PraiseType = Props & ReadonlyProps

export type PraiseResponse = Omit<
  PraiseType,
  'from' | 'to' | 'likes' | 'upVotes' | 'createdAt' | 'updatedAt'
> & {
  from: UserResponse
  to: UserResponse
  likes: UserResponse[]
  upVotes: UserResponse[]
  createdAt: string
  updatedAt: string
}

export class Praise {
  public readonly id: string
  public from: string
  public to: string
  public message: string
  public tags: string[]
  public likes: string[]
  public upVotes: string[]
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(praise: Props & Partial<ReadonlyProps>) {
    this.id = praise.id ? this.checkId(praise.id) : uuid()
    this.from = this.checkUserId(praise.from)
    this.to = this.checkUserId(praise.to)
    this.message = this.checkMessage(praise.message)
    this.tags = this.checkTags(praise.tags)
    this.likes = praise.likes ?? []
    this.upVotes = praise.upVotes ?? []
    this.createdAt = praise?.createdAt ?? dayjs()
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
      likes: this.likes,
      upVotes: this.upVotes,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
