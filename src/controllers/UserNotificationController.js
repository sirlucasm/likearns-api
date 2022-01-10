const knex = require('../config/knex');
const {
    createPagination
} = require('../utils');

module.exports = {
	async getUserNotifications(req, res, next) {
		try {
			const { id } = req.token;
			const daysAgo = new Date();
			daysAgo.setDate(daysAgo.getDate() - 15);
			const notifications = await knex('users_notifications')
				.select(
					'users_notifications.id', 'users_notifications.type', 'users_notifications.social_media', 'users_notifications.readed', 'users_notifications.created_at',
					knex.raw(`json_object(
						'id', users.id,
						'username', users.username,
						'email', users.email,
						'social_profile_picture', users.social_profile_picture
					) as user`),
					knex.raw(`(select json_object(
						'id', users.id,
						'username', users.username,
						'email', users.email,
						'social_profile_picture', users.social_profile_picture
					) from users where users.id = ${id}) as to_me`)
				)
				.join('users', 'users_notifications.user_id', 'users.id')
				.where({ 'users_notifications.to_user_id': id, readed: false })
				.andWhere('users_notifications.created_at', '>=', daysAgo)
				.orderBy('users_notifications.created_at', 'desc');
			if (notifications.length > 0) {
				notifications.map(notification  => {
					notification.user = JSON.parse(notification.user);
					notification.to_me = JSON.parse(notification.to_me);
				});
			}
			return res.status(200).json(notifications);
		} catch (error) {
			next(error);
		} return null;
	},

	async create(params) {
		const notifications = await knex('users_notifications').insert(params);
		return notifications;
	},

	async setNotificationReaded(req, res, next) {
		try {
			const { id } = req.token;
			const { notificationsList } = req.body;
			const notifications = await knex('users_notifications')
				.where({ to_user_id: id })
				.whereIn('id', notificationsList)
				.update({ readed: true, updated_at: knex.fn.now() });
			return res.json(notifications);
		} catch (error) {
			next(error);
		}
	},

	async getUserActivities(req, res, next) {
		try {
			const { id } = req.token;
			const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
			if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'));
			const allActivities = await knex('users_notifications');
			const activities = await knex('users_notifications')
				.select(
					'users_notifications.id', 'users_notifications.type', 'users_notifications.social_media', 'users_notifications.readed', 'users_notifications.created_at',
					knex.raw(`json_object(
						'id', users.id,
						'username', users.username,
						'email', users.email,
						'social_profile_picture', users.social_profile_picture
					) as to_me`),
					knex.raw(`(select json_object(
						'id', users.id,
						'username', users.username,
						'email', users.email,
						'social_profile_picture', users.social_profile_picture
					) from users where users.id = ${id}) as user`)
				)
				.join('users', 'users_notifications.to_user_id', 'users.id')
				.where({ 'users_notifications.user_id': id });

			if (activities.length > 0) {
				activities.map(activity  => {
					activity.user = JSON.parse(activity.user);
					activity.to_me = JSON.parse(activity.to_me);
				});
			}
			return res.status(200).json({ activities, pagination: createPagination(allActivities.length, page, limit) });
		} catch (error) {
			next(error);
		}
	},
};