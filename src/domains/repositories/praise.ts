import { Praise } from '~/domains/entities/praise'
import { PraiseLike } from '~/domains/entities/praiseLike'
import { PraiseUpVote } from '~/domains/entities/praiseUpVote'

export interface PraiseRepository {
  create(praise: Praise): Promise<Praise>
  getById(id: string): Promise<Praise | undefined>
  getList(): Promise<Praise[]>
  update(praise: Praise): Promise<Praise>
  deleteById(id: string): Promise<string>
  createLike(like: PraiseLike): Promise<Praise>
  deleteLike(like: PraiseLike): Promise<Praise>
  createUpVote(upVote: PraiseUpVote): Promise<Praise>
  deleteUpVote(upVote: PraiseUpVote): Promise<Praise>
}
