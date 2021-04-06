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
            const social_media = req.query.social_media;
			const { id } = req.token;
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))
			const users_followers = await knex('users_followers')
                .select('users_followers.day_name', 'gain_followers.obtained_followers')
                .join('gain_followers', 'users_followers.gain_follower_id', 'gain_followers.id')
                .where('gain_followers.social_media', social_media).andWhere('users_followers.user_id', id)
                .groupBy('users_followers.day_name');
			return res.json({ users_followers });
		} catch (error) {
			next(error);
		} return null;
    },
}