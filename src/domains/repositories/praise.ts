import { Praise } from '~/domains/entities/praise'

export interface PraiseRepository {
  create(praise: Praise): Promise<Praise>
  getById(id: string): Promise<Praise | undefined>
  getList(): Promise<Praise[]>
  update(praise: Praise): Promise<Praise>
  deleteById(id: string): Promise<string>
}
