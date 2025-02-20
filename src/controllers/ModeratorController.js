const knex = require('../config/knex');
const {
    createPagination,
} = require('../utils');
const { PAYPAL_APPROVE_PAYMENT_URL } = require('../constants/paypal');

module.exports = {
	async withdrawList(req, res, next) {
		try {
			const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const { search } = req.query;

            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'));

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

			if (search) {
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
			
			return res.json({ users_withdraws, pagination });
		} catch (error) {
			next(error);
		}
	},

	async usersList(req, res, next) {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);
		const { search } = req.query;
		try {
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'));
			const allUsers = await knex('users');
			let query = knex('users')
				.limit(limit)
				.offset((page - 1) * limit)
				.orderBy('id', 'desc');
			let pagination;

			if (search) query = query.where('username', 'like', '%'+ search +'%');

			const users = await query;

			if (users.length > 0) {
				users.map((data) => delete data.password);
				pagination = createPagination(users.length, page, limit);
			} else pagination = createPagination(allUsers.length, page, limit);

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

	async getApprovePaypalOrderUrl(req, res) {
		const { order_id, withdraw_id } = req.query;
		const url = `${PAYPAL_APPROVE_PAYMENT_URL}${order_id}`;

		await knex.transaction(async () => {
			await knex('users_withdraws')
				.where({ id: withdraw_id })
				.update({
					updated_at: knex.fn.now(),
					approved_order: true
				});
		});

		return res.status(200).json({ url });
	},

	async approvePaypalOrderPayment(req, res, next) {
        try {
            const { withdraw_id } = req.body;
			
			await knex.transaction(async () => {
				await knex('users_withdraws')
					.where({ id: withdraw_id })
					.update({
						updated_at: knex.fn.now(),
						status: 1
					});
			});

			return res.status(200).send();
        } catch (error) {
            next(error);
        }
    },

	async rejectPaypalOrderPayment(req, res, next) {
        try {
            const { id, user, reject_reason, lost_points } = req.body;
			
			await knex.transaction(async () => {
				await knex('users_withdraws')
					.where({ id })
					.update({
						updated_at: knex.fn.now(),
						status: 3,
						reject_reason,
					});
				await knex('users')
					.increment({ points: lost_points })
					.where({ id: user.id });
			});

			return res.status(200).send();
        } catch (error) {
            next(error);
        }
    },

	async listSocialMedias(req, res, next) {
        try {		
			const socialMedias = await knex('moderators_social_medias');

			return res.status(200).json(socialMedias);
        } catch (error) {
            next(error);
        }
    }
};