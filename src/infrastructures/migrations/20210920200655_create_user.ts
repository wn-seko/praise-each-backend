import Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('users'))) {
    return knex.schema.createTable('users', (t) => {
      t.string('id').primary()
      t.string('name').references('id').inTable('users').notNullable()
      t.string('icon').references('id').inTable('users').notNullable()
      t.date('createdAt').notNullable()
      t.date('updatedAt').notNullable()
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
