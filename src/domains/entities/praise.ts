import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { SystemInfo } from '~/utils/types'

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
    this.id = 'id' in praise ? praise.id : uuid()
    this.from = praise.from
    this.to = praise.to
    this.message = praise.message
    this.tags = praise.tags
    this.createdAt = 'createdAt' in praise ? praise.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
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
