exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.integer('followers').defaultTo(0);
	t.integer('likes').defaultTo(0);
	t.integer('invited_friends').defaultTo(0);
	t.integer('invited_total_points').defaultTo(0);
	t.string('referral_code_applied', 30);
	t.string('current_ip', 100).defaultTo(0);
});

exports.down = (knex) => knex.schema.dropTable('users');