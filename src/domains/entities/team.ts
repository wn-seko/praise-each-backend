import { v4 as uuid } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { SystemInfo } from '~/utils/types'
import {
  checkMinLength,
  checkMaxLength,
  checkValidUuidFormat,
  checkNoWhiteSpace,
  checkColorCode,
} from '../validator'

interface Props {
  name: string
  color: string
}

interface ReadonlyProps extends SystemInfo {
  userIds: string[]
}

export type TeamType = Props & ReadonlyProps

export type TeamResponse = Omit<TeamType, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class Team {
  public readonly id: string
  public name: string
  public color: string
  public userIds: string[]
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(team: TeamType | Props) {
    this.id = 'id' in team ? this.checkId(team.id) : uuid()
    this.name = this.checkName(team.name)
    this.color = this.checkColor(team.color)
    this.userIds = 'userIds' in team ? this.checkUserIds(team.userIds) : []
    this.createdAt = 'createdAt' in team ? team.createdAt : dayjs()
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

  private checkColor(value: string): string {
    checkColorCode(value)
    return value
  }

  private checkUserIds(value: string[]): string[] {
    value.forEach((id) => checkValidUuidFormat(id))
    return value
  }

  public update(props: Partial<Props>) {
    this.name = props.name ? this.checkName(props.name) : this.name
    this.color = props.color ? this.checkColor(props.color) : this.color
    this.updatedAt = dayjs()
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      userIds: this.userIds,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
