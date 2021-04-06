const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
const {
    createPagination,
	calculatePointsToEarn,
	getDayName
} = require('../utils');

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
            if (params.username){
                user = await knex('users').where({ username: params.username });
                if (user.length > 0) return res.status(400).json({ message: 'Este username/email já está em uso.' });
            }
			if (params.email) {
				user = await knex('users').where({ email: params.email });
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
						expiresIn: '7d',
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
	},

	async gainPointsFollowing(req, res, next) {
		try {
			const { id } = req.token;
			const { user_id, lost_points, gain_follower_id, followers, obtained_followers } = req.pointsToken;
			const earnPoints = calculatePointsToEarn(lost_points);
			knex.transaction(async () => {
				await knex('users').where({ id })
					.increment({ points: earnPoints, total_points: earnPoints })
					.update({ updated_at: knex.fn.now() });
				await knex('users_followers')
					.insert({
						followed_by_id: id,
						user_id,
						day_name: getDayName(),
						gain_follower_id
					});
				await knex('users').where({ id: user_id })
					.increment({ followers: 1 })
					.update({ updated_at: knex.fn.now() });
				await knex('gain_followers').where({ id: gain_follower_id })
					.increment({ obtained_followers: 1 })
					.update({ updated_at: knex.fn.now() });
				// check if followers number has been reached
				if ((obtained_followers+1) === followers) {
					await knex('gain_followers').where({ id: gain_follower_id })
						.update({ finished: true, updated_at: knex.fn.now() });
				}
			});
			return res.status(200).send();
		} catch (error) {
			next(error);
		}
	},
	
	async gainPointsLiking(req, res, next) {
		try {
			const { id } = req.token;
			const { user_id, lost_points, gain_like_id, likes, obtained_likes } = req.pointsToken;
			const earnPoints = calculatePointsToEarn(lost_points);
			knex.transaction(async () => {
				await knex('users').where({ id })
					.increment({ points: earnPoints, total_points: earnPoints })
					.update({ updated_at: knex.fn.now() });
				await knex('users_likes')
					.insert({
						liked_by_id: id,
						user_id,
						day_name: getDayName(),
						gain_like_id
					});
				await knex('users').where({ id: user_id })
					.increment({ likes: 1 })
					.update({ updated_at: knex.fn.now() });
				await knex('gain_likes').where({ id: gain_like_id })
					.increment({ obtained_likes: 1 })
					.update({ updated_at: knex.fn.now() });
				// check if likes number has been reached
				if ((obtained_likes+1) === likes) {
					await knex('gain_likes').where({ id: gain_like_id })
						.update({ finished: true, updated_at: knex.fn.now() });
				}
			});
			return res.status(200).send();
		} catch (error) {
			next(error);
		}
	},

	async verifyIfUserFollowed(req, res, next) {
		try {
			const { id } = req.token;
			const { gain_follower_id } = req.query;
			const followers_log = await knex('users_followers').where({ 'followed_by_id': id, gain_follower_id });
			return res.status(200).json({ following: followers_log.length > 0 ? true : false});
		} catch (error) {
			next(error);
		}
	},

	async verifyIfUserPostLiked(req, res, next) {
		try {
			const { id } = req.token;
			const { gain_like_id } = req.query;
			const likes_log = await knex('users_likes').where({ 'liked_by_id': id, gain_like_id });
			return res.status(200).json({ liking: likes_log.length > 0 ? true : false});
		} catch (error) {
			next(error);
		}
	},

	async verifyUserAuthenticity(req, res, next) {
		try {
			const { id } = req.token;
			const { password } = req.body;
			let user = await knex('users').where({ id });
			user = user[0];
			if (!password) res.status(400).json({ message: 'Nada recebido no body :(' })
			if (user) {
				const passwordValidate = await bcrypt.compare(
					password,
					user.password
				);
				if (passwordValidate) {
					const token = jwt.sign({ id: user.id }, process.env.JWT_PRIVATE_KEY,
					{
						expiresIn: '3h',
					});
					return res.status(200).json({ token });
				}
				return res.status(401).json({ message: 'É você mesmo? 👀 A senha digitada está incorreta. 🤔' });
			}
		} catch (error) {
			return res.status(401).json({ message: 'Falha na autenticação.' });
		}
	}
};