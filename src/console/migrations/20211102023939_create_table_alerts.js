exports.up = (knex) => knex.schema.createTable('alerts', (t) => {
	t.increments('id').primary();
	t.string('title', 100);
    t.string('description', 999).notNull();
    t.string('bg_color', 50).notNull();
    t.integer('mod_id').notNull().unsigned();

    t.foreign('mod_id').references('users.id');
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('alerts');