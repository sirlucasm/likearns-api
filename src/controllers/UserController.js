const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
const {
	calculatePointsToEarn,
	getDayName
} = require('../utils');
const InstagramController = require('./social_media/InstagramController');
const TwitterController = require('./social_media/TwitterController');
const UserNotificationController = require('./UserNotificationController');

const REFERRAL_FRIEND_POINTS = 875;
const INVITED_USER_POINTS = 375;

const referralFriend = async (username, invitedUsername) => {
	try {
		await knex.transaction(async () => {
			const friend = knex('users').where({ username }).first();
			await friend.increment({
				points: REFERRAL_FRIEND_POINTS,
				invited_friends: 1,
				invited_total_points: REFERRAL_FRIEND_POINTS,
				total_points: REFERRAL_FRIEND_POINTS,
			});
			const invitedUser = knex('users').where({ username: invitedUsername }).first();
			await invitedUser.increment({
				points: INVITED_USER_POINTS,
				total_points: INVITED_USER_POINTS,
			});
		});
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports = {
    async create(req, res, next) {
		try {
            const { params } = req.body;
			const referralCode = params.referral_code_applied;
            const user = await knex('users').where({ username: params.username }).orWhere({ email: params.email });
			const ipAddress = await knex('users').where({ current_ip: params.current_ip }).first();
			if (ipAddress && ipAddress.current_ip == params.current_ip) return res.status(401).json({ message: 'Não foi possível criar sua conta. 😞' });
            if (user.length > 0) return res.status(400).json({ message: 'Esta conta já existe' });
            const encryptedPassword = await bcrypt.hash(params.password, 10); // encrypt password
            params.password = encryptedPassword;
            const newUserId = await knex('users').insert(params); // database insert
            const token = jwt.sign({
                id: newUserId[0],
                ...params
			}, process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '1d',
            });
			if (referralCode) await referralFriend(referralCode, params.username);
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

	async resetPassword(req, res, next) {
		try {
			const { id } = req;
			const { params } = req.body;
			const encryptedPassword = await bcrypt.hash(params.password, 10); // encrypt password
			if (id)	{
				await knex('users').where({ id }).update({ password: encryptedPassword, updated_at: knex.fn.now() });
				return res.status(200).send();
			}
			return res.status(404).json({ message: 'Usuário não existe' });
		} catch (error) {
			next(error);
		}
    },
    
    async delete(req, res, next) {
		try {
            const { id } = req.token;
			const { token } = req.body;
			const tokenDecoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
			if (id === tokenDecoded.id)	{
				await knex('users').where({ id }).update({ deleted_at: knex.fn.now() });
			}
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },
    
    async me(req, res, next) {
		try {
			const { id } = req.token;
			const fetchMe = await knex('users').where({ id, deleted_at: null });
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
                user = await knex('users').where({ username: params.username, deleted_at: null });
            else if (Object.keys(params).includes('email'))
                user = await knex('users').where({ email: params.email, deleted_at: null });
			
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
			await knex('users').update({ verified_email: true, updated_at: knex.fn.now() }).where({ id, deleted_at: null });
			return res.status(200).send();
		} catch (error) {
			next(error);
		}
	},

	async gainPointsFollowing(req, res, next) {
		try {
			const { id } = req.token;
			const { user_id, lost_points, gain_follower_id, followers, obtained_followers, social_media, current_user } = req.pointsToken;
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
				await UserNotificationController.create({
					type: 1,
					social_media,
					user_id: current_user,
					to_user_id: user_id,
				});
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
			const { user_id, lost_points, gain_like_id, likes, obtained_likes, social_media, current_user } = req.pointsToken;
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
				await UserNotificationController.create({
					type: 2,
					social_media,
					user_id: current_user,
					to_user_id: user_id,
				});
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
			if (!password) res.status(400).json({ message: 'Nada recebido no body :(' });
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
	},

	async getTopSharers(req, res, next) {
		try {
			const LIMIT = 50;
			const users = await knex('users')
				.whereNot({ 'invited_friends': 0 })
				.orderBy('invited_friends', 'desc')
				.limit(LIMIT);
			return res.status(200).json({ users });
		} catch (error) {
			next(error);
		}
	},

	async claimReward(req, res, next) {
		try {
            const { id } = req.token;
			const { reward, points } = req.rewardToken;
			const now = knex.fn.now();

			knex.transaction(async () => {
				await knex('users').update({
					updated_at: now,
					[reward]: now
				}).where({ id });
				await knex('users').increment({ points }).where({ id });
			});
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },

	async resetReward(req, res, next) {
		try {
            const { id } = req.token;
			const { reward } = req.rewardToken;
			const now = knex.fn.now();

			knex.transaction(async () => {
				await knex('users').update({
					updated_at: now,
					[reward]: null
				}).where({ id });
			});
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },

	async importProfilePicture(req, res, next) {
		try {
            const { id } = req.token;
			const { username, socialMedia, instagramToken } = req.body;
			let profilePicUrl;
			const now = knex.fn.now();

			if (socialMedia == 1) profilePicUrl = await InstagramController.getProfilePicture(instagramToken);
			if (socialMedia == 2) profilePicUrl = await TwitterController.getProfilePicture(username);

			await knex('users').update({
				updated_at: now,
				social_profile_picture: profilePicUrl
			}).where({ id });
			return res.status(200).send();
		} catch (error) {
			next(error);
		} return null;
    },

	async isVerifiedEmail(req, res, next) {
		try {
			const { id } = req.token;
			const user = await knex('users').where({ id }).first();
			return res.status(200).json({ isVerifiedEmail: user.verified_email == 1 });
		} catch (error) {
			next(error);
		}
	},
};