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
                .select('users_followers.day_name', 'gain_followers.obtained_followers as obtained_values', 'gain_followers.social_media')
                .join('gain_followers', 'users_followers.gain_follower_id', 'gain_followers.id')
                .where('gain_followers.social_media', social_media).andWhere('users_followers.user_id', id)
                .groupBy('users_followers.day_name');
            if (users_followers.length <= 0) return res.json([{
                day_name: 'Nenhum dado capturado',
                obtained_followers: 0
            }])
			return res.json(users_followers);
		} catch (error) {
			next(error);
		} return null;
    },
	
	async followersHistory(req, res, next) {
		try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const social_media = req.query.social_media;
			const filters = req.query.filters;
			const { id } = req.token;

            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'));

			let users_followers = knex('users_followers')
                .select('users_followers.*',
					knex.raw(`json_object(
						'id', users.id,
						'username', users.username,
						'email', users.email,
						'social_profile_picture', users.social_profile_picture
					) as user`),
					knex.raw(`json_object(
						'obtained_followers', gain_followers.obtained_followers,
						'social_media', gain_followers.social_media
					) as gain_followers`)
				)
                .join('gain_followers', 'users_followers.gain_follower_id', 'gain_followers.id')
				.join('users', 'gain_followers.user_id', 'users.id');

			if (filters.action === 1) users_followers.where('gain_followers.social_media', social_media).andWhere('users_followers.followed_by_id', id);
			else if (filters.action === 2) users_followers.where('gain_followers.social_media', social_media).andWhere('users_followers.user_id', id);
			
			users_followers = await users_followers;

			users_followers.map(data => {
				delete data.user_id;
				delete data.followed_by_id;
				delete data.gain_follower_id;
			})

			return res.json(users_followers);
		} catch (error) {
			next(error);
		} return null;
    },
}