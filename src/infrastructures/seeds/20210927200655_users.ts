import dayjs from 'dayjs'
import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'ME',
      icon: 'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'User-1',
      icon: 'https://react.semantic-ui.com/images/avatar/large/molly.png',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'User-2',
      icon: 'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'User-3',
      icon: 'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
      created_at: dayjs(),
      updated_at: dayjs(),
    },
  ])
}
