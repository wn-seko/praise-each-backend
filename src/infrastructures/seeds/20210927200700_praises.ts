import dayjs from 'dayjs'
import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('praises').del()

  // Inserts seed entries
  await knex('praises').insert([
    {
      id: '10000000-0000-0000-0000-000000000001',
      from: '00000000-0000-0000-0000-000000000000',
      to: '00000000-0000-0000-0000-000000000001',
      message: 'sample #test',
      tags: ['test'],
      created_at: dayjs(),
      updated_at: dayjs(),
    },
  ])
}
