import dayjs from 'dayjs'
import * as Knex from 'knex'
import { User } from '~/domains/entities/user'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  await knex<User>('users').insert([
    {
      id: '00000000-0000-0000-0000-000000000000',
      snsId: 'dummy1',
      name: 'ME',
      icon: 'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
      createdAt: dayjs(),
      updatedAt: dayjs(),
    },
    {
      id: '00000000-0000-0000-0000-000000000001',
      snsId: 'dummy1',
      name: 'User-1',
      icon: 'https://react.semantic-ui.com/images/avatar/large/molly.png',
      createdAt: dayjs(),
      updatedAt: dayjs(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      snsId: 'dummy2',
      name: 'User-2',
      icon: 'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
      createdAt: dayjs(),
      updatedAt: dayjs(),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      snsId: 'dummy3',
      name: 'User-3',
      icon: 'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
      createdAt: dayjs(),
      updatedAt: dayjs(),
    },
  ])
}
