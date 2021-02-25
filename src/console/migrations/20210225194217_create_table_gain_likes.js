exports.up = (knex) => knex.schema.createTable('gain_likes', (t) => {
	t.increments('id').primary();
	t.integer('social_media', 2).notNull();
	t.integer('likes', 3).notNull();
	t.string('post_url').notNull();
	
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('users');