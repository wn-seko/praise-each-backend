import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { SystemInfo } from '~/utils/types'
import {
  checkMinLength,
  checkMaxLength,
  checkValidUuidFormat,
  checkNoWhiteSpace,
} from '../validator'

interface Props {
  name: string
}

export type TagType = Props & SystemInfo

export type TagResponse = Omit<TagType, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class Tag {
  public readonly id: string
  public name: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(tag: TagType | Props) {
    this.id = 'id' in tag ? this.checkId(tag.id) : uuid()
    this.name = this.checkName(tag.name)
    this.createdAt = 'createdAt' in tag ? tag.createdAt : dayjs()
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

  public update(props: Partial<Props>) {
    this.name = props.name ? this.checkName(props.name) : this.name
    this.updatedAt = dayjs()
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
