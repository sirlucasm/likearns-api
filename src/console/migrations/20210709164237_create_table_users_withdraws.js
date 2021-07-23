exports.up = (knex) => knex.schema.createTable('users_withdraws', (t) => {
	t.increments('id').primary();
    t.integer('withdraw_type').notNull();
    t.string('order_id').notNull();
    t.string('pix_key');
    t.string('email_address');
    t.string('reject_reason');
    t.boolean('approved_order').defaultTo(false);
    t.decimal('value').notNull();
    t.integer('lost_points').notNull();
    t.integer('user_id').notNull().unsigned();
	t.integer('status').defaultTo(0);

    t.foreign('user_id').references('users.id');
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('users_withdraws');