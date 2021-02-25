exports.up = (knex) => knex.schema.createTable('gain_followers', (t) => {
	t.increments('id').primary();
	t.integer('social_media', 2).notNull();
	t.integer('followers', 3).notNull();
	t.string('username', 30).notNull();
	
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('gain_followers');