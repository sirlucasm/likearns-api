const express = require('express');

const routes = express.Router();

const MailerController = require('../controllers/MailerController');

// middlewares
const authentication = require('../middleware/Authentication');

// MAILER
routes
	.get('/send-verification', authentication, MailerController.sendConfirmationEmail)
	.post('/send-reset-password', MailerController.sendResetPasswordEmail);

module.exports = routes;