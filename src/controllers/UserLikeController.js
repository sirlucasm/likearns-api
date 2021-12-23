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
			const users_likes = await knex('users_likes')
                .select('users_likes.day_name', 'gain_likes.social_media')
				.sum('gain_likes.obtained_likes as obtained_values')
                .join('gain_likes', 'users_likes.gain_like_id', 'gain_likes.id')
                .where('gain_likes.social_media', social_media).andWhere('users_likes.user_id', id)
                .groupBy('users_likes.day_name');
            if (users_likes.length <= 0) return res.json([{
                day_name: 'Nenhum dado capturado',
                obtained_values: 0
            }]);
			return res.json(users_likes);
		} catch (error) {
			next(error);
		} return null;
    },

	async likesHistory(req, res, next) {
		try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const social_media = req.query.social_media;
			const action = req.query.action;
			const { id } = req.token;

            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'));

			let users_likes = knex('users_likes')
                .select('users_likes.*',
					knex.raw(`json_object(
						'id', users.id,
						'username', users.username,
						'email', users.email,
						'social_profile_picture', users.social_profile_picture
					) as user`),
					knex.raw(`json_object(
						'likes', gain_likes.likes,
						'obtained_likes', gain_likes.obtained_likes,
						'social_media', gain_likes.social_media,
						'lost_points', gain_likes.lost_points,
						'finished', gain_likes.finished
					) as gain_like`)
				)
                .join('gain_likes', 'users_likes.gain_like_id', 'gain_likes.id')
				.join('users', 'gain_likes.user_id', 'users.id');

			if (action == 1) users_likes.where('users_likes.liked_by_id', id);
			if (action == 0 || action == 2) users_likes.where('users_likes.user_id', id);

			if (!!social_media && social_media > 0) users_likes.where('gain_likes.social_media', social_media);

			const pagination = createPagination((await users_likes).length, page, limit);

			users_likes = await users_likes
				.limit(limit)
				.offset((page - 1) * limit)
				.orderBy('id', 'desc');

			users_likes.map(data => {
				delete data.user_id;
				delete data.liked_by_id;
				delete data.gain_like_id;
				data.user = JSON.parse(data.user);
				data.gain_like = JSON.parse(data.gain_like);
			});

			return res.json({ users_likes, pagination });
		} catch (error) {
			next(error);
		} return null;
    },
};