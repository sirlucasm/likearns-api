exports.up = (knex) => knex.schema.alterTable('addresses', (t) => {
	t.dropColumn('neighboard');
	t.renameColumn('complement', 'state');
	t.renameColumn('complement2', 'address');
});

exports.down = (knex) => knex.schema.dropTable('addresses');