const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const tokenDecoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		if (tokenDecoded && tokenDecoded.user_type === 'moderator') {
			req.moderatorToken = tokenDecoded;
			next();
		} else return res.status(401).json({ message: 'Acesso apenas para moderadores.' });
	} catch (error) {
		return res.status(401).json({ message: 'Acesso apenas para moderadores.' });
	}
};