exports.up = (knex) => knex.schema.raw('SET sql_mode="TRADITIONAL"');

exports.down = (knex) => knex.schema.dropTable('users_followers');