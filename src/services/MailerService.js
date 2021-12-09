const mailer = require('../config/nodemailer');
const fs = require('fs');
const hbs = require('handlebars');

module.exports = {
    sendMail(to, subject, params, path, callback) {
        const templateHbsPath = fs.readFileSync(path).toString('utf-8');
        const hbsTemplateParse = hbs.compile(templateHbsPath);
        const html = hbsTemplateParse(params);
        
        mailer.sendMail({
            html,
            subject,
            from: '"Contato Likearns" <contato@app.likearns.com>',
            to
        }, callback);
    }
};