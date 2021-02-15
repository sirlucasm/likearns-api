const mailer = require('../config/nodemailer');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const confirmationEmail = require('../templates/mail/confirmationEmail');

module.exports = {
	async sendConfirmationEmail(req, res, next) {
		try {
            const { id, email, name } = req.token;
            const params = {};
            const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '10h',
            });

            params.token = token.split('').reverse().join('');
            params.to = { email, name: name.split(' ')[0] };
            mailer.sendMail({
                html: confirmationEmail(params),
                subject: '[no-reply] Confirme sua conta',
                from: '"Contato Likearns" <contato@likearns.com.br>',
                to: email,
            }, (error, info) => {
                if (error) {
                    console.log(`Error occurred. ${error.message}`);
                    return res.status(500).send()
                }
                if (process.env.NODE_ENV === 'development') console.log(`\nEmail Confirmation Sent\npreview in: ${nodemailer.getTestMessageUrl(info)}\n`);
                return res.status(200).send();
            });
        } catch (error) {
            return next(error);
        }
	},
};