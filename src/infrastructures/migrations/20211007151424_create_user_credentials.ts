import Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user_credentials'))) {
    return knex.schema.createTable('user_credentials', (t) => {
      t.string('user_id')
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')

      t.string('oauth_id').notNullable()
      t.string('oauth_type').notNullable()
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.primary(['user_id', 'oauth_id', 'oauth_type'])
    })
  } else {
    console.warn('user_credentials is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('user_credentials')) {
    return knex.schema.dropTable('user_credentials')
  }
}
