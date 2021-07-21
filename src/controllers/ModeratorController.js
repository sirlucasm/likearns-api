const knex = require('../config/knex');
const {
    createPagination,
} = require('../utils');

// services
const PaypalService = require('../services/PaypalService');

module.exports = {
	async withdrawList(req, res, next) {
		try {
			const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const { search } = req.query;

            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))

			const allUsersWithdraws = await knex('users_withdraws');
			let query = knex('users_withdraws')
				.select(
					'users_withdraws.*',
					knex.raw(`json_object(
						'id', users.id,
						'username', users.username,
						'email', users.email,
						'social_profile_picture', users.social_profile_picture
					) as user`)
				)
				.join('users', 'users.id', 'users_withdraws.user_id')
				.limit(limit)
				.offset((page - 1) * limit)
				.orderBy('id', 'desc');
			let pagination;

			if (!!search) {
				query = query
					.where('users.username', 'like', '%'+ search +'%');
			}
			const users_withdraws = await query;

			if (users_withdraws.length > 0) {
				users_withdraws.map(withdraw => {
					withdraw.user = JSON.parse(withdraw.user);
					delete withdraw.user_id;
				});
				pagination = createPagination(allUsersWithdraws.length, page, limit);
			} else {
				pagination = createPagination(users_withdraws.length, page, limit);
			}
			
			return res.json({ users_withdraws, pagination })
		} catch (error) {
			next(error);
		}
	},

	async usersList(req, res, next) {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const { search } = req.query;
		try {
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))
			const allUsers = await knex('users');
			let query = knex('users')
				.limit(limit)
				.offset((page - 1) * limit)
				.orderBy('id', 'desc');
			let pagination;

			if (!!search) query = query.where('username', 'like', '%'+ search +'%');

			const users = await query;

			if (users.length > 0) {
				users.map((data) => delete data.password);
				pagination = createPagination(allUsers.length, page, limit);
			} else pagination = createPagination(users.length, page, limit);

			return res.json({ users, pagination });
		} catch (error) {
			next(error);
		}
	},

	async totalData(req, res, next) {
		try {
			const users = (await knex('users')).length;
			const users_withdraws = (await knex('users_withdraws')).length;
			const users_followers = (await knex('users_followers')).length;
			const users_likes = (await knex('users_likes')).length;

			return res.json({
				users: { total: users },
				users_withdraws: { total: users_withdraws },
				users_followers: { total: users_followers },
				users_likes: { total: users_likes }
			});
		} catch (error) {
			next(error);
		}
	},

	async capturePaypalOrder(req, res, next) {
        try {
            const { withdraw_id, order_id } = req.body;
            const orderCaptured = await PaypalService.captureOrder(order_id);
			
			if (orderCaptured.id == order_id && orderCaptured.status == 'COMPLETED') {
				await knex.transaction(async () => {
					await knex('users_withdraws')
						.where({ id: withdraw_id })
						.update({
							updated_at: knex.fn.now(),
							status: 1
						});
				});

				return res.status(200).json(orderCaptured);
			}
            return res.status(500).json({ message: 'Não foi possível concluir o pagamento, pois o Admin ainda não aprovou.' });
        } catch (error) {
            next(error);
        }
    }
}