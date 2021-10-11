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
  icon: string
}

export type UserType = Props & SystemInfo

export type UserResponse = Omit<UserType, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class User {
  public readonly id: string
  public name: string
  public icon: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(user: UserType | Props) {
    this.id = 'id' in user ? this.checkId(user.id) : uuid()
    this.name = this.checkName(user.name)
    this.icon = this.checkIcon(user.icon)
    this.createdAt = 'createdAt' in user ? user.createdAt : dayjs()
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

  private checkIcon(value: string): string {
    checkMinLength(value, 1)
    checkMaxLength(value, 5000)
    return value
  }

  public update(props: Partial<Props>) {
    this.name = props.name ??= this.name
    this.icon = props.icon ??= this.icon
    this.updatedAt = dayjs()
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
