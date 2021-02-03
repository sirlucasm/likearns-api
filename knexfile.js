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
		connection: {
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT
		},
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