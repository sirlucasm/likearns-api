exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.string('user_type', 10).defaultTo('user');
	t.date('deleted_at');
});

exports.down = (knex) => knex.schema.dropTable('users');