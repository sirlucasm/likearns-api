const jwt = require('jsonwebtoken');
const knex = require('../config/knex');

module.exports = async (req, res, next) => {
	try {
		const { token } = req.body.params;
		// invert token
		const reInvertedToken = token.split('').reverse().join('');
		const verifyToken = jwt.verify(reInvertedToken, process.env.JWT_PRIVATE_KEY);
		const user = await knex('users').where({ id: verifyToken.id });

		if (user.length > 0) {
			req.id = user[0].id;
			next();
		} else return res.status(404).json({ message: 'Usuário não existe' });
	} catch (err) {
		return res.status(401).json({ message: 'Token inválido ou expirado.' });
	}
};