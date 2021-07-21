const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
const {
    createPagination,
} = require('../utils');

// services
const PaypalService = require('../services/PaypalService');

module.exports = {
	async index(req, res, next) {
		try {
			const { id } = req.token;
			const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);

            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))

			const allUsersWithdraws = await knex('users_withdraws');
			const users_withdraws = await knex('users_withdraws')
				.limit(limit)
				.offset((page - 1) * limit)
                .orderBy('id', 'desc')
				.where({ user_id: id });
			return res.json({ users_withdraws, pagination: createPagination(allUsersWithdraws.length, page, limit) })
		} catch (error) {
			next(error);
		}
	},
    async createPaypalOrder(req, res, next) {
        try {
			const { id } = req.token;
            const params = req.body;
            const order = await PaypalService.createOrder(params.email_address, params.value);

			if (!order) return res.status(400).json({ message: 'Não foi possível criar retirada do seu dinheiro' });
			params.user_id = id;
            params.order_id = order.id;
            await knex.transaction(async () => {
                await knex('users').decrement({
                    points: params.lost_points
                }).where({ id });
                await knex('users_withdraws').insert(params);
            });

            return res.status(200).json({ order });
        } catch (error) {
            next(error);
        }
    },
};