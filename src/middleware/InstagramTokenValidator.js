const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const { instagramToken } = req.body;
		const tokenDecoded = jwt.verify(instagramToken, process.env.JWT_PRIVATE_KEY);
		if (tokenDecoded) {
            req.instagramToken = tokenDecoded;
            next();
        }
	} catch (error) {
		return res.status(401).json({ message: 'Token de autenticação inválido' });
	} return null;
};