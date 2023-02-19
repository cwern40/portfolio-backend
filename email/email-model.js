const nodemailer = require('nodemailer');
const log = require('loglevel');
<<<<<<< HEAD
const custLog = require('../helper/helpers').logToFile;
const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';
=======
>>>>>>> 3b0587d4bd6bf4a12f11af4549e78df1b8c1049f

module.exports = {
    sendEmail
}

async function sendEmail (data) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
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
<<<<<<< HEAD
        custLog(logName, email, 'email send error');
=======
>>>>>>> 3b0587d4bd6bf4a12f11af4549e78df1b8c1049f
        return false;
    }
}