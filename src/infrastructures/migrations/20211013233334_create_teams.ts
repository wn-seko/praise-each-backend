import Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('teams'))) {
    return knex.schema.createTable('teams', (t) => {
      t.string('id').primary()
      t.string('name').notNullable()
      t.string('color').notNullable()
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.index('name', 'teams_name_idx')
    })
  } else {
    console.warn('teams is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('teams')) {
    return knex.schema.dropTable('teams')
  }
}
