import Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('users'))) {
    return knex.schema.createTable('users', (t) => {
      t.string('id').primary()
      t.string('sns_id').notNullable()
      t.string('name').notNullable()
      t.string('icon').notNullable()
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.index('sns_id', 'users_sns_id_idx')
      t.index('name', 'users_name_idx')
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
