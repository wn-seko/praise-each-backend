import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('praise_likes'))) {
    return knex.schema.createTable('praise_likes', (t) => {
      t.string('praise_id')
        .references('id')
        .inTable('praises')
        .notNullable()
        .onUpdate('CASCADE')
      t.string('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .notNullable()
        .onUpdate('CASCADE')
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.primary(['praise_id', 'user_id'])
    })
  } else {
    console.warn('praise_likes is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('praise_likes')) {
    return knex.schema.dropTable('praise_likes')
  }
}
