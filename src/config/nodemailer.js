const nodemailer = require('nodemailer');

let transporter;

if (process.env.NODE_ENV === 'production') {
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
} else {
	transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
			user: 'dahlia.corwin16@ethereal.email',
			pass: 'Nzbksh9GZG7Ys6kNUs',
		},
	});
}

module.exports = transporter;