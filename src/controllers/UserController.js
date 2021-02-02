const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
// const MailerController = require('./MailerController');

module.exports = {

	async index(req, res, next) {
		try {
			return res.json({ message: "hello" });
		} catch (error) {
			next(error);
		} return null;
	},
};