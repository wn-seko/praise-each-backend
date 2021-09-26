import * as Knex from 'knex'
import { User } from '~/domains/entities/user'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('praises').del()

  // Inserts seed entries
  await knex<User>('users').insert([])
}
