exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.integer('total_points').notNull().defaultTo(0);
});

exports.down = (knex) => knex.schema.dropTable('users');