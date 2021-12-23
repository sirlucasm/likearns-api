exports.up = (knex) => knex.schema.createTable('moderators_social_medias', (t) => {
	t.increments('id').primary();
	t.string('name', 100);
	t.timestamps(true, true);
});

exports.down = (knex) => knex.schema.dropTable('moderators_social_medias');