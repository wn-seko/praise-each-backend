import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { SystemInfo } from '~/utils/types'
import {
  checkMaxLength,
  checkMinLength,
  checkValidUuidFormat,
} from '../validator'
import { UserResponse } from './user'

interface Stamp {
  stampId: string
  userIds: string[]
}

interface Props {
  from: string
  to: string
  message: string
  tags: string[]
}

interface ReadonlyProps extends SystemInfo {
  likes: string[]
  upVotes: string[]
  stamps: Stamp[]
}

export type PraiseType = Props & ReadonlyProps

export type PraiseResponse = Omit<
  PraiseType,
  'from' | 'to' | 'likes' | 'upVotes' | 'stamps' | 'createdAt' | 'updatedAt'
> & {
  from: UserResponse
  to: UserResponse
  likes: UserResponse[]
  upVotes: UserResponse[]
  stamps: Array<{
    stampId: string
    users: UserResponse[]
  }>
  createdAt: string
  updatedAt: string
}

export interface PraiseQueryParams {
  from?: string | string[]
  to?: string | string[]
  offset: number
  limit: number
}

export class Praise {
  public readonly id: string
  public from: string
  public to: string
  public message: string
  public tags: string[]
  public likes: string[]
  public upVotes: string[]
  public stamps: Stamp[]
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
    this.stamps = praise.stamps ?? []
    this.createdAt = praise?.createdAt ?? dayjs()
    this.updatedAt = praise?.updatedAt ?? this.createdAt.clone()
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
    this.from = props.from ? this.checkUserId(props.from) : this.from
    this.to = props.to ? this.checkUserId(props.to) : this.to
    this.message = props.message
      ? this.checkMessage(props.message)
      : this.message
    this.tags = props.tags ? this.checkTags(props.tags) : this.tags
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
      stamps: this.stamps,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
