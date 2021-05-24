exports.up = (knex) => knex.schema.createTable('users_notifications', (t) => {
	t.increments('id').primary();
    t.integer('type').notNull();
    t.integer('social_media').notNull();
    t.integer('user_id').notNull().unsigned();
    t.integer('to_user_id').notNull().unsigned();
	t.boolean('readed').defaultTo(false);

    t.foreign('user_id').references('users.id');
    t.foreign('to_user_id').references('users.id');
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('users_notifications');