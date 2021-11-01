import { Team } from '~/domains/entities/team'
import { UserAffiliation } from '~/domains/entities/userAffiliations'

export interface TeamRepository {
  create(team: Team): Promise<Team>
  count: (word: string) => Promise<number>
  getById(id: string): Promise<Team | undefined>
  getByIds(ids: string[]): Promise<Team[]>
  getList(offset: number, limit: number): Promise<Team[]>
  search(word: string, offset: number, limit: number): Promise<Team[]>
  update(team: Team): Promise<Team>
  deleteById(id: string): Promise<string>
  addUser(userAffiliation: UserAffiliation): Promise<Team>
  removeUser(userAffiliation: UserAffiliation): Promise<Team>
}
