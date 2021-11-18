import dayjs, { Dayjs } from 'dayjs'

interface Props {
  praiseId: string
  userId: string
  stampId: string
}

export type PraiseStampType = Props & {
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type PraiseStampResponse = Omit<
  PraiseStampType,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export class PraiseStamp {
  public readonly praiseId: string
  public readonly userId: string
  public readonly stampId: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(praiseStamp: PraiseStampType | Props) {
    this.praiseId = praiseStamp.praiseId
    this.userId = praiseStamp.userId
    this.stampId = praiseStamp.stampId
    this.createdAt =
      'createdAt' in praiseStamp ? praiseStamp.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  public toJSON(): PraiseStampResponse {
    return {
      praiseId: this.praiseId,
      userId: this.userId,
      stampId: this.stampId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
