exports.up = (knex) => knex.schema.alterTable('users_followers', (t) => {
	t.integer('gain_follower_id').unsigned().notNull();

	t.foreign('gain_follower_id').references('gain_followers.id');
});

exports.down = (knex) => knex.schema.dropTable('users_followers');