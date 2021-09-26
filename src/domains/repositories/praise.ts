import { Praise } from '~/domains/entities/praise'

export interface PraiseRepository {
  create(praise: Praise): Promise<string>
  getById(id: string): Promise<Praise | undefined>
  getList(): Promise<Praise[]>
  update(praise: Praise): Promise<string>
  deleteById(id: string): Promise<Praise>
}
