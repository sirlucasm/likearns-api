const MailerService = require('../services/MailerService');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const knex = require('../config/knex');
const confirmationEmail = require('../templates/mail/confirmationEmail');
const path = require('path');

module.exports = {
    async sendConfirmationEmail(req, res, next) {
        try {
            const { id, email, name } = req.token;
            const params = {};
            const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY,
                {
                    expiresIn: '10h',
                });
            const templateHbsPath = path.resolve(__dirname, '..', 'templates', 'mail', 'confirmationEmail.hbs');

            params.token = token.split('').reverse().join('');
            params.email = email;
            params.name = name.split(' ')[0];

            const subject = '[no-reply] Confirme sua conta';

            return MailerService.sendMail(email, subject, params, templateHbsPath,
                (error, info) => {
                    if (error) {
                        console.log(`Error occurred. ${error.message}`);
                        res.status(500).send();
                    }
                    if (process.env.NODE_ENV === 'development') console.log(`\nEmail Confirmation Sent\npreview in: ${nodemailer.getTestMessageUrl(info)}\n`);
                    res.status(200).send();
                });
        } catch (error) {
            return next(error);
        }
    },

    async sendResetPasswordEmail(req, res, next) {
        try {
            const params = {};
            const { email } = req.body;
            const templateHbsPath = path.resolve(__dirname, '..', 'templates', 'mail', 'resetPassword.hbs');
            const user = await knex('users').where({ email }).first();
            params.email = email;
            params.name = user.name;

            const subject = '[no-reply] Esqueceu a senha?';

            if (user) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_PRIVATE_KEY,
                    {
                        expiresIn: '10h',
                    });
                params.token = token.split('').reverse().join('');
                params.resetUrl = process.env.REACT_APP_URL + '/minha-conta/trocar-senha?tk=' + params.token;
                delete user.password;

                return MailerService.sendMail(email, subject, params, templateHbsPath,
                    (error, info) => {
                        if (error) {
                            console.log(`Error occurred. ${error.message}`);
                            res.status(500).send();
                        }
                        if (process.env.NODE_ENV === 'development') console.log(`\nEmail Confirmation Sent\npreview in: ${nodemailer.getTestMessageUrl(info)}\n`);
                        res.status(200).send();
                    });
            }
            return res.status(400).json({ message: 'Email informado não está cadastrado no Likearns' });
        } catch (error) {
            return next(error);
        }
    },
};