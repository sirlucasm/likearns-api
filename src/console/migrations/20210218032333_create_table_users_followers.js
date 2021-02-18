exports.up = (knex) => knex.schema.createTable('users_followers', (t) => {
	t.increments('id').primary();
	t.integer('followed_by_id').unsigned();
	t.integer('user_id').unsigned();
	t.string('day_name', 20);

	t.foreign('followed_by_id').references('users.id');
    t.foreign('user_id').references('users.id');

	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('users');