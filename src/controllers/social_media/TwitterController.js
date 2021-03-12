const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_KEY_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
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
            const { username, userId } = req.body;
			const params = {
				screen_name: username,
				user_id: userId
			};

			const response = await client.post('friendships/create', params);
			return res.status(200).json(response);
		} catch (error) {
			return Promise.reject(error);
		}
	},

    async verifyFriendship(req, res, next) {
		try {
            const { username, friendName } = req.query;
			const params = {
				source_screen_name: username,
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
}