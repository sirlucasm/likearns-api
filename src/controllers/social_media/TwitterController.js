const Twitter = require('twitter');
const LoginWithTwitter = require('login-with-twitter');
const knex = require('../../config/knex');
const jwt = require('jsonwebtoken');

const client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_KEY_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

const tw = new LoginWithTwitter({
	consumerKey: process.env.TWITTER_API_KEY,
	consumerSecret: process.env.TWITTER_API_KEY_SECRET,
	callbackUrl: process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_URL+'/ganhar-earnscoins' : process.env.REACT_APP_URL+'/ganhar-earnscoins'
});

module.exports = {
	async followersListIds(req, res, next) {
		try {
            const { username } = req.query
			const params = {
				screen_name: username,
				count: 200,
				skip_status: true,
				include_user_entities: false
			};

			const response = await client.get('followers/ids', params);
			return res.status(200).json(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},

    async followUser(req, res, next) {
		try {
            const { username, twitter, user_id, lost_points, id } = req.body;
			const clientUser = new Twitter({
                consumer_key: process.env.TWITTER_API_KEY,
                consumer_secret: process.env.TWITTER_API_KEY_SECRET,
                access_token_key: twitter.userToken,
                access_token_secret: twitter.userTokenSecret
            });
			const params = {
				screen_name: username,
			};

			const token = jwt.sign({ user_id, lost_points, gain_follower_id: id }, process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '1h',
			});

			const response = await clientUser.post('friendships/create', params);
			return res.status(200).json({ twitter: response, token });
		} catch (error) {
			return Promise.reject(error);
		}
	},

    async verifyFriendship(req, res, next) {
		try {
            const { userName, friendName } = req.query;
			const params = {
				source_screen_name: userName,
				target_screen_name: friendName,
			};

			const response = await client.get('friendships/show', params);
			return res.status(200).json({ following: response.relationship.source.following });
		} catch (error) {
			return Promise.reject(error);
		}
	},

    async searchUser(req, res, next) {
		try {
            const { username } = req.query;
			const params = {
				q: username,
			};
            const clientUser = new Twitter({
                consumer_key: process.env.TWITTER_API_KEY,
                consumer_secret: process.env.TWITTER_API_KEY_SECRET,
                access_token_key: process.env.TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            });

			const response = await clientUser.get('users/search', params);
			return res.status(200).json({ id: response[0].id, username: response[0].screen_name });
		} catch (error) {
			return Promise.reject(error);
		}
	},

	async login(req, res, next) {
		try {
			tw.login((err, tokenSecret, url) => {
				if (err) console.log(err)
				return res.status(200).json({ authUrl: url, tokenSecret })
			});
		} catch (error) {
			return Promise.reject(error);
		}
	},

	async callback(req, res, next) {
		try {
			const { oauth_token, oauth_verifier, tokenSecret } = req.body;
			tw.callback({
				oauth_token: oauth_token,
				oauth_verifier: oauth_verifier
			}, tokenSecret, (err, user) => {
				if (err) console.log(err);
				return res.status(200).json(user)
			});
		} catch (error) {
			return Promise.reject(error);
		}
	},
}