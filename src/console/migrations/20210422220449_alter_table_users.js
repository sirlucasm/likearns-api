exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.string('current_ip', 100).notNullable().alter();
});

exports.down = (knex) => knex.schema.dropTable('users');