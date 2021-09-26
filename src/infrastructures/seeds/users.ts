import dayjs from 'dayjs'
import * as Knex from 'knex'
import { v4 as uuid } from 'uuid'
import { User } from '~/domains/entities/user'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  await knex<User>('users').insert([
    {
      id: 'user-0001',
      snsId: 'dummy1',
      name: 'User-1',
      icon: 'dummy',
      createdAt: dayjs(),
      updatedAt: dayjs(),
    },
    {
      id: 'user-0002',
      snsId: 'dummy2',
      name: 'User-2',
      icon: 'dummy',
      createdAt: dayjs(),
      updatedAt: dayjs(),
    },
    {
      id: 'user-0003',
      snsId: 'dummy3',
      name: 'User-3',
      icon: 'dummy',
      createdAt: dayjs(),
      updatedAt: dayjs(),
    },
  ])
}
