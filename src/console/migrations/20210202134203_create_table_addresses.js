exports.up = (knex) => knex.schema.createTable('addresses', (t) => {
	t.increments('id').primary();
    t.string('neighboard', 50).notNull();
	t.string('country', 50).notNull();
	t.string('city', 50).notNull();
	t.string('complement', 100);
    t.string('complement2', 100);
    t.string('number', 50).notNull();

	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('addresses');