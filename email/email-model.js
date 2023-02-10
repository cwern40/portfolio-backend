const nodemailer = require('nodemailer');
const logger = require('logger').createLogger();

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
        logger.error('email send error', email);
        return false;
    }
}