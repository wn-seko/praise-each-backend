import dayjs from 'dayjs'
import { TeamPin } from '~/domains/entities/teamPin'
import { TeamPinRepository } from '~/domains/repositories/teamPin'
import { knex } from '~/infrastructures/database'

interface DbTeamPinProps {
  team_id: string
  user_id: string
  created_at: string
  updated_at: string
}

const resultToTeamPin = (result: DbTeamPinProps): TeamPin => {
  return new TeamPin({
    teamId: result.team_id,
    userId: result.user_id,
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const teamPinToDbType = (teamPin: TeamPin): DbTeamPinProps => ({
  team_id: teamPin.teamId,
  user_id: teamPin.userId,
  created_at: teamPin.createdAt.toISOString(),
  updated_at: teamPin.updatedAt.toISOString(),
})

export class SQLTeamPinRepository implements TeamPinRepository {
  async getByUserId(userId: string): Promise<TeamPin[]> {
    const result = await knex<DbTeamPinProps>('team_pins').where({
      user_id: userId,
    })
    return result ? result.map(resultToTeamPin) : []
  }

  async create(teamPin: TeamPin): Promise<TeamPin> {
    const results = await knex<DbTeamPinProps>('team_pins').insert(
      teamPinToDbType(teamPin),
      '*',
    )
    return resultToTeamPin(results[0])
  }

  async delete(teamPin: TeamPin): Promise<TeamPin> {
    await knex<DbTeamPinProps>('team_pins')
      .where({ user_id: teamPin.userId, team_id: teamPin.teamId })
      .delete()
    return teamPin
  }
}
