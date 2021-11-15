import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('team_slack_webhooks'))) {
    return knex.schema.createTable('team_slack_webhooks', (t) => {
      t.string('id').primary()
      t.string('team_id')
        .references('id')
        .inTable('teams')
        .notNullable()
        .onDelete('CASCADE')
      t.string('url').notNullable()
      t.string('name').notNullable()
      t.string('description').notNullable()
      t.timestamp('created_at').notNullable()
      t.timestamp('updated_at').notNullable()
      t.index('team_id', 'team_slack_webhooks_team_id_idx')
    })
  } else {
    console.warn('team_slack_webhooks is exists.')
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('team_slack_webhooks')) {
    return knex.schema.dropTable('team_slack_webhooks')
  }
}
