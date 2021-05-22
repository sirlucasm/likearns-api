exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.text('social_profile_picture', 'longtext').alter();
});

exports.down = (knex) => knex.schema.dropTable('users');