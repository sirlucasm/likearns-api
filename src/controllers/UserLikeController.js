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
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))
			const users_likes = await knex('users_likes')
                .select('users_likes.day_name', 'gain_likes.obtained_likes')
                .join('gain_likes', 'users_likes.gain_like_id', 'gain_likes.id')
                .where('gain_likes.social_media', social_media).andWhere('users_likes.user_id', id)
                .groupBy('users_likes.day_name');
			return res.json({ users_likes });
		} catch (error) {
			next(error);
		} return null;
    },
}