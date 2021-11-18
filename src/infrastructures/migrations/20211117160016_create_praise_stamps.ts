import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('praise_stamps'))) {
    return knex.schema.createTable('praise_stamps', (t) => {
      t.string('praise_id')
        .notNullable()
        .references('id')
        .inTable('praises')
        .notNullable()
        .onDelete('CASCADE')
      t.string('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      t.string('stamp_id').notNullable()
      t.timestamp('created_at').notNullable()
      t.primary(['praise_id', 'user_id', 'stamp_id'])
    })
  } else {
    console.warn('praise_stamps is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('praise_stamps')) {
    return knex.schema.dropTable('praise_stamps')
  }
}
