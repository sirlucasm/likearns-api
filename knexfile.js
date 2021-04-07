require('dotenv/config');

module.exports = {

	development: {
		client: 'mysql',
		connection: {
			database: 'likearns_dev',
			user: 'root',
			password: '',
			port: '3306'
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
			host: process.env.DB_HOST,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
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