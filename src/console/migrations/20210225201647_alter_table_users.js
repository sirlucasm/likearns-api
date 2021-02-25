exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.integer('social_profile_picture');
});

exports.down = (knex) => knex.schema.dropTable('users');