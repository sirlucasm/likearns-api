const AUTH_URL = ``;

module.exports = {
    async auth(req, res, next) {
		try {
            const { params } = req.body;
			return res.send("testado");
		} catch (error) {
			next(error);
		} return null;
    },
}