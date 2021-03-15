exports.up = (knex) => knex.schema.alterTable('users_likes', (t) => {
	t.integer('gain_like_id').unsigned().notNull();

	t.foreign('gain_like_id').references('gain_likes.id');
});

exports.down = (knex) => knex.schema.dropTable('users_likes');