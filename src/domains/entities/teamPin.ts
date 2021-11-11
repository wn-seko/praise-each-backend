import dayjs, { Dayjs } from 'dayjs'
import { checkValidUuidFormat } from '../validator'

interface Props {
  teamId: string
  userId: string
}

export type TeamPinType = Props & {
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type TeamPinResponse = Omit<TeamPinType, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class TeamPin {
  public readonly teamId: string
  public readonly userId: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(teamPin: TeamPinType | Props) {
    this.teamId = this.checkId(teamPin.teamId)
    this.userId = this.checkId(teamPin.userId)
    this.createdAt = 'createdAt' in teamPin ? teamPin.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  private checkId(value: string): string {
    checkValidUuidFormat(value)
    return value
  }

  public toJSON(): TeamPinResponse {
    return {
      teamId: this.teamId,
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
