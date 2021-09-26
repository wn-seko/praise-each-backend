import Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('users'))) {
    return knex.schema.createTable('users', (t) => {
      t.string('id').primary()
      t.string('snsId').notNullable()
      t.string('name').notNullable()
      t.string('icon').notNullable()
      t.timestamp('createdAt').notNullable()
      t.timestamp('updatedAt').notNullable()
    })
  } else {
    console.warn('users is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('users')) {
    return knex.schema.dropTable('users')
  }
}
