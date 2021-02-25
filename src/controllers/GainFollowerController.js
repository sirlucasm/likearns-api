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
			const allFollowers = await knex('gain_followers');
			const followers = await knex('gain_followers')
				.limit(limit)
				.offset((page - 1) * limit)
                .orderBy('id', 'desc');
			return res.json({ followers, pagination: createPagination(allFollowers.length, page, limit) });
		} catch (error) {
			next(error);
		} return null;
    },

	async create(req, res, next) {
		try {
			const { params } = req.body;
			const followers = await knex('gain_followers').where({ username: params.username });
			if (followers.length > 0) return res.status(400).json({ message: 'Já existe uma publicação com esse usuário' });
			await knex('gain_followers').insert(params);
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },
};