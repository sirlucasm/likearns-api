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
			const allUsers = await knex('users_likes');
			const users_likes = await knex('users_likes')
                .select('users_likes.day_name', 'gain_likes.obtained_likes')
                .sum('gain_likes.obtained_likes as obtained_likes')
                .join('gain_likes', 'users_likes.user_id', 'gain_likes.user_id')
                .where('gain_likes.social_media', social_media)
				.limit(limit)
				.offset((page - 1) * limit)
                .groupBy('users_likes.day_name');
			return res.json({ users_likes, pagination: createPagination(allUsers.length, page, limit) });
		} catch (error) {
			next(error);
		} return null;
    },
}