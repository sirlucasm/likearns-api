const knex = require('../config/knex');
const {
    createPagination,
} = require('../utils');

module.exports = {
	async index(req, res, next) {
		try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const social_media = req.query.social_media;
			const { id } = req.token;
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'));
			const users_followers = await knex('users_followers')
                .select('users_followers.day_name', 'gain_followers.social_media')
				.sum('gain_followers.obtained_followers as obtained_values')
                .join('gain_followers', 'users_followers.gain_follower_id', 'gain_followers.id')
                .where('gain_followers.social_media', social_media).andWhere('users_followers.user_id', id)
                .groupBy('users_followers.day_name');
            if (users_followers.length <= 0) return res.json([{
                day_name: 'Nenhum dado capturado',
                obtained_values: 0
            }]);
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
			const action = req.query.action;
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
						'followers', gain_followers.followers,
						'obtained_followers', gain_followers.obtained_followers,
						'social_media', gain_followers.social_media,
						'lost_points', gain_followers.lost_points,
						'finished', gain_followers.finished
					) as gain_follower`)
				)
                .join('gain_followers', 'users_followers.gain_follower_id', 'gain_followers.id')
				.join('users', 'gain_followers.user_id', 'users.id');
				
			if (action == 1) users_followers.where('users_followers.followed_by_id', id);
			if (action == 0 || action == 2) users_followers.where('users_followers.user_id', id);

			if (!!social_media && social_media > 0) users_followers.where('gain_followers.social_media', social_media);
			
			const pagination = createPagination((await users_followers).length, page, limit);

			users_followers = await users_followers
				.limit(limit)
				.offset((page - 1) * limit)
				.orderBy('id', 'desc');

			users_followers.map(data => {
				delete data.user_id;
				delete data.followed_by_id;
				delete data.gain_follower_id;
				data.user = JSON.parse(data.user);
				data.gain_follower = JSON.parse(data.gain_follower);
			});

			return res.json({ users_followers, pagination });
		} catch (error) {
			next(error);
		} return null;
    },
};