import dayjs from 'dayjs'
import { Team, TeamType } from '~/domains/entities/team'
import { UserAffiliation } from '~/domains/entities/userAffiliations'
import { TeamRepository } from '~/domains/repositories/team'
import { knex } from '~/infrastructures/database'

interface DbTeamProps {
  id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

interface DbTeamType extends DbTeamProps {
  user_ids: string[]
}

interface DbUserAffiliation {
  team_id: string
  user_id: string
  created_at: string
  updated_at: string
}

const resultToTeam = (result: DbTeamType): Team => {
  return new Team({
    ...result,
    userIds: (result.user_ids || []).filter((item) => !!item),
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const teamToDbType = (team: TeamType): DbTeamProps => ({
  id: team.id,
  name: team.name,
  color: team.color,
  created_at: team.createdAt.toISOString(),
  updated_at: team.updatedAt.toISOString(),
})

const userAffiliationToDbType = (
  userAffiliation: UserAffiliation,
): DbUserAffiliation => ({
  team_id: userAffiliation.teamId,
  user_id: userAffiliation.userId,
  updated_at: userAffiliation.updatedAt.toISOString(),
  created_at: userAffiliation.createdAt.toISOString(),
})

const buildGetTeamsQuery = (
  whereOptions: Record<string, unknown> = {},
  offset?: number,
  limit?: number,
) => {
  let baseQuery = knex.select('*').from('teams')

  const { ids, name, ...options } = whereOptions || {}

  baseQuery = ids ? baseQuery.whereIn('id', ids as string[]) : baseQuery
  baseQuery = name ? baseQuery.where('name', 'ilike', `%${name}%`) : baseQuery
  baseQuery = options ? baseQuery.where(options) : baseQuery
  baseQuery = baseQuery = baseQuery.as('t')

  let mainQuery = knex
    .select([
      't.*',
      knex.raw('ARRAY_AGG(user_affiliations.user_id) as user_ids'),
    ])
    .from(baseQuery)
    .leftJoin('user_affiliations', 't.id', 'user_affiliations.team_id')
    .groupBy(
      't.id',
      't.name',
      't.color',
      't.created_at',
      't.updated_at',
      'user_affiliations.team_id',
    )
    .orderBy('t.created_at', 'desc')

  if (offset) {
    mainQuery = mainQuery.offset(offset)
  }

  if (limit) {
    mainQuery = mainQuery.limit(limit)
  }

  return mainQuery
}

const buildGetTeamQuery = (teamId: string) => {
  const mainQuery = buildGetTeamsQuery({ id: teamId }, 0, 1)
  return mainQuery.first()
}

export class SQLTeamRepository implements TeamRepository {
  async create(team: Team): Promise<Team> {
    const results = await knex<DbTeamType>('teams').insert(
      teamToDbType(team),
      '*',
    )
    return resultToTeam(results[0])
  }

  async count(word: string): Promise<number> {
    const result = word
      ? await knex<number>('teams').count().where('name', 'ilike', `%${word}%`)
      : await knex<number>('teams').count()

    return Number(result[0].count)
  }

  async getById(id: string): Promise<Team | undefined> {
    const result = await buildGetTeamQuery(id)
    return result ? resultToTeam(result) : undefined
  }

  async getByIds(ids: string[]): Promise<Team[]> {
    const results = await buildGetTeamsQuery({ ids })
    return results.map(resultToTeam)
  }

  async getList(offset: number, limit: number): Promise<Team[]> {
    const results = await buildGetTeamsQuery({}, offset, limit)
    return results.map(resultToTeam)
  }

  async search(word: string, offset: number, limit: number): Promise<Team[]> {
    const results = await buildGetTeamsQuery({ name: word }, offset, limit)
    return results.map(resultToTeam)
  }

  async update(team: Team): Promise<Team> {
    const [updated] = await knex<DbTeamType>('teams')
      .where('id', team.id)
      .update(teamToDbType(team), '*')

    const result = await buildGetTeamQuery(updated.id)

    return resultToTeam(result)
  }

  async deleteById(id: string): Promise<string> {
    await knex<TeamType>('teams').where({ id }).del<Team>()
    return id
  }

  async addUser(userAffiliation: UserAffiliation): Promise<Team> {
    await knex<DbUserAffiliation>('user_affiliations').insert(
      userAffiliationToDbType(userAffiliation),
    )

    const result = await buildGetTeamQuery(userAffiliation.teamId)
    return resultToTeam(result)
  }

  async removeUser(userAffiliation: UserAffiliation): Promise<Team> {
    await knex<DbUserAffiliation>('user_affiliations')
      .where({
        team_id: userAffiliation.teamId,
        user_id: userAffiliation.userId,
      })
      .delete()

    const result = await buildGetTeamQuery(userAffiliation.teamId)
    return resultToTeam(result)
  }
}
