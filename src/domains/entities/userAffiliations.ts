import dayjs, { Dayjs } from 'dayjs'

interface Props {
  teamId: string
  userId: string
}

export type UserAffiliationType = Props & {
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type UserAffiliationResponse = Omit<
  UserAffiliationType,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export class UserAffiliation {
  public readonly teamId: string
  public readonly userId: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(userAffiliation: UserAffiliationType | Props) {
    this.teamId = userAffiliation.teamId
    this.userId = userAffiliation.userId
    this.createdAt =
      'createdAt' in userAffiliation ? userAffiliation.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  public toJSON(): UserAffiliationResponse {
    return {
      teamId: this.teamId,
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
