import { Praise, PraiseQueryParams } from '~/domains/entities/praise'
import { PraiseLike } from '~/domains/entities/praiseLike'
import { PraiseStamp } from '~/domains/entities/praiseStamp'
import { PraiseUpVote } from '~/domains/entities/praiseUpVote'

export interface PraiseRepository {
  create(praise: Praise): Promise<Praise>
  getById(id: string): Promise<Praise | undefined>
  getList(queryParams: PraiseQueryParams): Promise<Praise[]>
  update(praise: Praise): Promise<Praise>
  deleteById(id: string): Promise<string>
  createLike(like: PraiseLike): Promise<Praise>
  deleteLike(like: PraiseLike): Promise<Praise>
  createUpVote(upVote: PraiseUpVote): Promise<Praise>
  deleteUpVote(upVote: PraiseUpVote): Promise<Praise>
  createStamp(stamp: PraiseStamp): Promise<Praise>
  deleteStamp(stamp: PraiseStamp): Promise<Praise>
}
