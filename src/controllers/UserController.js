const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
const {
    createPagination
} = require('../utils');
// const MailerController = require('./MailerController');

const referralFriend = async (username) => {
	try {
		await knex.transaction(async () => {
			const friend = knex('users').where({ username });
			await friend.increment({
				points: 150,
				invited_friends: 1,
				invited_total_points: 150
			})
		})
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = {
	async index(req, res, next) {
		try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            if (!page || !limit) return next(new Error('Nenhuma pagina/limite definido'))
			const allUsers = await knex('users');
			const users = await knex('users')
				.limit(limit)
				.offset((page - 1) * limit)
                .orderBy('id', 'desc');
            users.map((data) => delete data.password);
			return res.json({ users, pagination: createPagination(allUsers.length, page, limit) });
		} catch (error) {
			next(error);
		} return null;
    },

    async create(req, res, next) {
		try {
            const { params } = req.body;
			const referralCode = params.referral_code_applied;
            const user = await knex('users').where({ username: params.username }).orWhere({ email: params.email });
            if (user.length > 0) return res.status(400).json({ message: 'Esta conta já existe' });
            const encryptedPassword = await bcrypt.hash(params.password, 10); // encrypt password
            params.password = encryptedPassword;
            const newUserId = await knex('users').insert(params); // database insert
            const token = jwt.sign({
                id: newUserId[0],
                ...params
			}, process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '10h',
            });
			if (referralCode) await referralFriend(referralCode);
            return res.status(201).json({ token });
        } catch (error) {
			next(error);
		} return null;
    },

    async update(req, res, next) {
		try {
            const { params } = req.body;
			params.updated_at = knex.fn.now();
            const { id } = req.token;
            let user;
            if (params.email || params.username){
                user = await knex('users').where({ username: params.username }).orWhere({ email: params.email });
                if (user.length > 0) return res.status(400).json({ message: 'Este username/email já está em uso.' });
            }
			await knex('users').update(params).where({ id });
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },
    
    async delete(req, res, next) {
		try {
            const { id } = req.token;
			await knex('users').where({ id }).delete();
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },
    
    async me(req, res, next) {
		try {
			const { id } = req.token;
			const fetchMe = await knex('users').where({ id });
			let me = {};
			if (fetchMe.length > 0) {
				fetchMe.map((response) => {
					delete response.password;
					if (response) me = response;
				});
				return res.status(200).json(me);
			}
			return res.status(401).json(me);
		} catch (error) {
			return next(error);
		}
    },
    
    async login(req, res, next) {
		try {
            const { params } = req.body;
            let user;
            if (Object.keys(params).includes('username'))
                user = await knex('users').where({ username: params.username });
            else if (Object.keys(params).includes('email'))
                user = await knex('users').where({ email: params.email });
			
			if (user.length > 0) {
				const passwordValidate = await bcrypt.compare(
					params.password,
					user[0].password,
				);
				if (passwordValidate) {
					const token = jwt.sign({ ...user[0] }, process.env.JWT_PRIVATE_KEY,
					{
						expiresIn: '20d',
					});
					return res.status(200).json({ token });
				}
				return res.status(401).json({ message: 'Email ou senha estão incorretos' });
			}
			return res.status(401).json({ message: 'Email ou senha estão incorretos' });
		} catch (error) {
			next(error);
		}
		return null;
	},

	async verifyAccount(req, res, next) {
		try {
			const { id } = req;
			await knex('users').update({ verified_email: true, updated_at: knex.fn.now() }).where({ id });
			return res.status(200).send();
		} catch (error) {
			next(error);
		}
	}
};