import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('tags'))) {
    return knex.schema.createTable('tags', (t) => {
      t.string('id').primary()
      t.string('name').notNullable()
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.index('name', 'tags_name_idx')
    })
  } else {
    console.warn('tags is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('tags')) {
    return knex.schema.dropTable('tags')
  }
}
