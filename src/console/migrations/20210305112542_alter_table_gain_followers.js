exports.up = (knex) => knex.schema.alterTable('gain_followers', (t) => {
	t.boolean('finished').defaultTo(false);
	t.integer('user_id').unsigned().notNull();
	t.integer('obtained_followers').notNull();

	t.foreign('user_id').references('users.id');
});

exports.down = (knex) => knex.schema.dropTable('gain_followers');