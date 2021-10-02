import dayjs from 'dayjs'
import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('praise_likes').del()

  // Inserts seed entries
  await knex('praise_likes').insert([
    {
      praise_id: '10000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000000',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
    {
      praise_id: '10000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000001',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
    {
      praise_id: '10000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000002',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
    {
      praise_id: '10000000-0000-0000-0000-000000000001',
      user_id: '00000000-0000-0000-0000-000000000003',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
  ])
}
