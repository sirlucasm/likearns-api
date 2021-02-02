const knexfile = require('../../knexfile');
const knex = require('knex')(knexfile[process.env.NODE_ENV]);

module.exports = knex;