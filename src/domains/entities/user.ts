import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { SystemInfo } from '~/utils/types'

interface Props {
  name: string
  snsId: string
  icon: string
}

export type UserType = Props & SystemInfo

export class User {
  public readonly id: string
  public snsId: string
  public name: string
  public icon: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(user: UserType | Props) {
    this.id = 'id' in user ? user.id : uuid()
    this.snsId = user.snsId
    this.name = user.name
    this.icon = user.icon
    this.createdAt = 'createdAt' in user ? user.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
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
