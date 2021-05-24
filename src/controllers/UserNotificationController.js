const knex = require('../config/knex');
const {
	createPagination,
} = require('../utils');

module.exports = {
	async getUserNotifications(req, res, next) {
		try {
			const { id } = req.token;
			const daysAgo = new Date();
			daysAgo.setDate(daysAgo.getDate() - 15);

			const notifications = await knex('users_notifications')
				.where({
					to_user_id: id,
					readed: false,
				})
				.andWhere('created_at', '>=', daysAgo)
				.orderBy('created_at', 'desc');
			return res.status(200).json(notifications);
		} catch (error) {
			next(error);
		} return null;
	},

	async create(params) {
		const notifications = await knex('users_notifications').insert(params);
		return notifications;
	},
}