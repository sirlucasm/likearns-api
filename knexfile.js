require('dotenv/config');

module.exports = {

	development: {
		client: 'mysql',
		connection: {
			database: 'likearns_dev',
			user: 'root',
			password: 'root',
			port: '3305'
		},
		pool: { min: 0, max: 7 },
		migrations: {
			tableName: 'knex_migrations',
			directory: `${__dirname}/src/console/migrations`,
		},
		useNullAsDefault: true,
	},

	production: {
		client: 'mysql',
		connection: process.env.DB_URL,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: `${__dirname}/src/console/migrations`,
		},
		useNullAsDefault: true,
	},

};