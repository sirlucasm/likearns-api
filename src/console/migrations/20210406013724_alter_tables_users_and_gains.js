exports.up = (knex) => {
	knex.schema.alterTable('users_followers', (t) => {
		t.integer('user_id').unsigned().onDelete('CASCADE');
		t.integer('followed_by_id').unsigned().onDelete('CASCADE');
		t.foreign('user_id').references('users.id');
		t.foreign('followed_by_id').references('users.id');
	});

	knex.schema.alterTable('users_likes', (t) => {
		t.integer('user_id').unsigned().onDelete('CASCADE');
		t.integer('liked_by_id').unsigned().onDelete('CASCADE');
		t.foreign('user_id').references('users.id');
		t.foreign('liked_by_id').references('users.id');
	});

	knex.schema.alterTable('gain_followers', (t) => {
		t.integer('user_id').unsigned().onDelete('CASCADE');
		t.foreign('user_id').references('users.id');
	});

	knex.schema.alterTable('gain_likes', (t) => {
		t.integer('user_id').unsigned().onDelete('CASCADE');
		t.foreign('user_id').references('users.id');
	});
};

exports.down = (knex) => {
	knex.schema.dropTable('users_followers');
	knex.schema.dropTable('users_likes');
}