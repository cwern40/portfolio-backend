const nodemailer = require('nodemailer');
const log = require('loglevel');
// const custLog = require('../helper/helpers').logToFile;
const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';

module.exports = {
    sendEmail
}

async function sendEmail (data) {
    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            type: "OAuth2",
            Username: process.env.MAIL_USER,
            Password: process.env.MAIL_PASS
        }
    })

    let email = await transporter.sendMail({
        from: '"Portfolio Site" <chris.wernli@hotmail.com>',
        to: 'chris.wernli40@gmail.com',
        subject: 'PORTFOLIO SITE MESSAGE',
        html: `<p><strong>NAME:</strong> ${data.name}</p>
            <p><strong>EMAIL:</strong> ${data.email}</p>
            <p><strong>MESSAGE:</strong> ${data.message}</p>`
    })

    if (email.messageId) {
        return true;
    } else {
        log.error('email send error', email);
        // custLog(logName, email, 'email send error');
        return false;
    }
}