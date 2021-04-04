const knex = require('../config/knex');
const {
    createPagination,
	calculatePointsToEarn,
	getDayName
} = require('../utils');

module.exports = {
	async index(req, res, next) {
		try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const social_media = req.query.social_media
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))
			const allUsers = await knex('users_followers');
			const users_followers = await knex('users_followers')
                .select('users_followers.day_name', 'gain_followers.obtained_followers')
                .join('gain_followers', 'users_followers.user_id', 'gain_followers.user_id')
                .where('gain_followers.social_media', social_media)
				.limit(limit)
				.offset((page - 1) * limit)
                .groupBy('users_followers.day_name');
			return res.json({ users_followers, pagination: createPagination(allUsers.length, page, limit) });
		} catch (error) {
			next(error);
		} return null;
    },
}