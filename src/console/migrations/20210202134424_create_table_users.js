exports.up = (knex) => knex.schema.createTable('users', (t) => {
	t.increments('id').primary();
    t.string('name', 100).notNull();
    t.string('paypal_email', 100).unique();
	t.string('email', 100).unique().notNull();
	t.string('username', 30).unique().notNull();
	t.string('password', 100).notNull();
    t.date('birth_date').notNull();
    t.integer('address_id').unsigned();
	t.integer('points').notNull().defaultTo(0);
	t.boolean('verified_email').defaultTo(false);
    t.boolean('verified_paypal_email').defaultTo(false);

    t.foreign('address_id').references('addresses.id')
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('users');