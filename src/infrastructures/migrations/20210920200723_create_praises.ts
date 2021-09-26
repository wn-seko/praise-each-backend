import Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('praises'))) {
    return knex.schema.createTable('praises', (t) => {
      t.string('id').primary()
      t.string('from').references('id').inTable('users').notNullable()
      t.string('to').references('id').inTable('users').notNullable()
      t.string('message').notNullable()
      t.specificType('tags', 'text ARRAY').defaultTo('{}')
      t.timestamp('createdAt').notNullable()
      t.timestamp('updatedAt').notNullable()
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
