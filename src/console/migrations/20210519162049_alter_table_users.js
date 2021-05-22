exports.up = (knex) => knex.schema.alterTable('users', (t) => {
	t.string('current_ip').notNullable().alter();
    t.datetime('reward_daily');
    t.datetime('reward_level1');
    t.datetime('reward_level5');
    t.datetime('reward_level10');
    t.datetime('reward_level50');
    t.datetime('reward_level100');
});

exports.down = (knex) => knex.schema.dropTable('users');