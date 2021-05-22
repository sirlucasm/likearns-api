const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const { rewardToken } = req.body;
		const tokenDecoded = jwt.verify(rewardToken, process.env.JWT_PRIVATE_KEY);
		req.rewardToken = tokenDecoded;
		if (tokenDecoded) next();
	} catch (error) {
		return res.status(401).json({ message: 'Token de recompensas inválido' });
	} return null;
};