const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const { token } = req.query;
		const tokenDecoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		req.pointsToken = tokenDecoded;
		if (tokenDecoded) next();
	} catch (error) {
		return res.status(401).json({ message: 'Token de pontos inválido' });
	} return null;
};