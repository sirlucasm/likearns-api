const Instagram = require('instagram-web-api');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const auth = async ({ username, password }) => {
	const client = new Instagram({ username, password });
	const { authenticated } = await client.login();
	console.log('Instagram account is logged: ' + authenticated + '\n');
	return client;
};

module.exports = {
	async login(req, res, next) {
		try {
			const { username, password } = req.body;
			const client = await auth({ username, password });
			const user = await client.getProfile();
			if (user) {
				const token = jwt.sign({ username, password }, process.env.JWT_PRIVATE_KEY,
				{
					expiresIn: '7d',
				});
				return res.status(200).json({
					username: user.username,
					token
				});
			} return res.status(401).json({ message: 'Usuário ou senha estão incorretos' });
		} catch (error) {
			next(error);
		} return null;
	},

	async getProfilePicture(instagramToken) {
		const { username, password } = {
			username: process.env.INSTAGRAM_USERNAME,
			password: process.env.INSTAGRAM_PASSWORD
		};
		const userLogged = jwt.verify(instagramToken, process.env.JWT_PRIVATE_KEY);
		const client = await auth({ username, password });
		const user = await client.getUserByUsername({ username: userLogged.username });
		return user.profile_pic_url_hd;
	},

	async likePost(req, res, next) {
		try {
			const { username, password } = req.instagramToken;
			const { postId, user_id, lost_points, id, likes, obtained_likes, social_media, current_user } = req.body;
			const client = await auth({ username, password });

			if (client) {				
				const token = jwt.sign({
					user_id,
					lost_points,
					gain_like_id: id,
					likes,
					obtained_likes,
					social_media,
					current_user
				}, process.env.JWT_PRIVATE_KEY,
				{
					expiresIn: '1h',
				});

				await client.like({ mediaId: postId });

				return res.status(200).json({ token });
			} return res.status(401).json({ message: 'Usuário não autenticado.' });
		} catch (error) {
			next(error);
		} return null;
	},

	async getMediaData(req, res, next) {
		try {
			const { post_url } = req.query;
			
			const { data: embed } = await axios.get('http://api.instagram.com/oembed', {
				params: {
					url: post_url
				},
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					'Access-Control-Allow-Credentials': 'true'
				}
			});
			if (embed) {
				return res.status(200).json(embed);
			} return res.status(400).json({ message: 'Erro ao adquirir Instagram Media ID' });
		} catch (error) {
			next(error);
		} return null;
	},
}