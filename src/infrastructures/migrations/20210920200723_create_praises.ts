import Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('praises'))) {
    return knex.schema.createTable('praises', (t) => {
      t.string('id').primary()
      t.string('from')
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      t.string('to')
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      t.string('message').notNullable()
      t.specificType('tags', 'text ARRAY').defaultTo('{}')
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.index('from', 'praises_from_idx')
      t.index('to', 'praises_to_idx')
      t.index('tags', 'praises_tags_idx')
    })
  } else {
    console.warn('praises is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('praises')) {
    return knex.schema.dropTable('praises')
  }
}
