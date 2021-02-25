const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
const {
    createPagination
} = require('../utils');

module.exports = {
	async index(req, res, next) {
		try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))
			const allLikes = await knex('gain_likes');
			const likes = await knex('gain_likes')
				.limit(limit)
				.offset((page - 1) * limit)
                .orderBy('id', 'desc');
			return res.json({ likes, pagination: createPagination(allLikes.length, page, limit) });
		} catch (error) {
			next(error);
		} return null;
    },

    async create(req, res, next) {
		try {
			const { params } = req.body;
			const likes = await knex('gain_likes').where({ post_url: params.post_url });
			if (likes.length > 0) return res.status(400).json({ message: 'Já existe uma publicação com essa URL' });
			await knex('gain_likes').insert(params);
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },
};