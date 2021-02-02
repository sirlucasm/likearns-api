require('dotenv/config');

module.exports = {

	development: {
		client: 'mssql',
		connection: {
			database: 'fire4dev_dev',
			user: 'postgres',
			password: 'postgres',
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: `${__dirname}/src/migrations`,
		},
		useNullAsDefault: true,
	},

	production: {
		client: 'mssql',
		connection: process.env.DB_URL,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: `${__dirname}/src/migrations`,
		},
		useNullAsDefault: true,
	},

};