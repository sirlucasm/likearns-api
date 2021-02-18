exports.up = (knex) => knex.schema.createTable('users_likes', (t) => {
	t.increments('id').primary();
	t.integer('liked_by_id').unsigned();
	t.integer('user_id').unsigned();
	t.string('day_name', 20);
	
	t.foreign('liked_by_id').references('users.id');
    t.foreign('user_id').references('users.id');
	
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('users');