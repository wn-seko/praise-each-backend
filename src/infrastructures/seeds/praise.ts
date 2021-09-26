import * as Knex from 'knex'

export const seed = async (knex: Knex): Promise<Knex> => {
  // Deletes ALL existing entries
  return knex('praises')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('praises').insert([
        { id: 1, title: 'rowValue1', memo: 'memo', done: 0 },
        { id: 2, title: 'rowValue2', memo: 'memo', done: 1 },
        { id: 3, title: 'rowValue3', memo: 'memo' },
      ])
    })
}
