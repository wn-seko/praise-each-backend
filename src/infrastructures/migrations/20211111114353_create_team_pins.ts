import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('team_pins'))) {
    return knex.schema.createTable('team_pins', (t) => {
      t.string('team_id')
        .references('id')
        .inTable('teams')
        .notNullable()
        .onDelete('CASCADE')
      t.string('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.primary(['team_id', 'user_id'])
    })
  } else {
    console.warn('team_pins is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('team_pins')) {
    return knex.schema.dropTable('team_pins')
  }
}
