import dayjs, { Dayjs } from 'dayjs'

interface Props {
  praiseId: string
  userId: string
}

export type PraiseLikeType = Props & {
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type PraiseLikeResponse = Omit<
  PraiseLikeType,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export class PraiseLike {
  public readonly praiseId: string
  public readonly userId: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(praiseLike: PraiseLikeType | Props) {
    this.praiseId = praiseLike.praiseId
    this.userId = praiseLike.userId
    this.createdAt = 'createdAt' in praiseLike ? praiseLike.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  public toJSON(): PraiseLikeResponse {
    return {
      praiseId: this.praiseId,
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
