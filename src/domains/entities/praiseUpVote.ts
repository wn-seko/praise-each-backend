import dayjs, { Dayjs } from 'dayjs'

interface Props {
  praiseId: string
  userId: string
}

export type PraiseUpVoteType = Props & {
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type PraiseUpVoteResponse = Omit<
  PraiseUpVoteType,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export class PraiseUpVote {
  public readonly praiseId: string
  public readonly userId: string
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(praiseUpVote: PraiseUpVoteType | Props) {
    this.praiseId = praiseUpVote.praiseId
    this.userId = praiseUpVote.userId
    this.createdAt =
      'createdAt' in praiseUpVote ? praiseUpVote.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  public toJSON(): PraiseUpVoteResponse {
    return {
      praiseId: this.praiseId,
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
