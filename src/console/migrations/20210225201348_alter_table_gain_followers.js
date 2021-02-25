exports.up = (knex) => knex.schema.alterTable('gain_followers', (t) => {
	t.integer('lost_points').notNull();
});

exports.down = (knex) => knex.schema.dropTable('gain_followers');