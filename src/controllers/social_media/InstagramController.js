const Instagram = require('instagram-web-api');
const jwt = require('jsonwebtoken');

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

	async getProfilePicture(userName) {
		const { username, password } = {
			username: process.env.INSTAGRAM_USERNAME,
			password: process.env.INSTAGRAM_PASSWORD
		};
		const client = await auth({ username, password });
		const user = await client.getUserByUsername({ username: userName });
		return user.profile_pic_url_hd;
	},
}