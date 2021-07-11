exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.string('paypal_email').alter();
	t.string('pix_key');
	t.dropColumn('verified_paypal_email');
});

exports.down = (knex) => knex.schema.dropTable('users');