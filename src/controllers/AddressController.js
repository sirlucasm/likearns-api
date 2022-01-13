const knex = require('../config/knex');

module.exports = {
	async create (userId) {
		knex.transaction(async () => {
			const address = await knex('addresses').insert({});
			await knex('users').update({ address_id: address[0] }).where({ id: userId });
		});
	},

	async find (req, res, next) {
		try {
			const { id } = req.params;
			const address = await knex('addresses').where({ id }).first();
			return res.status(200).json(address);
		} catch (error) {
			next(error);
		}
    },

    async update (req, res, next) {
		try {
			const params = req.body;
			const { id } = req.params;
			await knex('addresses').update(params).where({ id });
			return res.status(200).send();
		} catch (error) {
			next(error);
		}
    },
};