const nodemailer = require('nodemailer');
const log = require('loglevel');
const custLog = require('../helper/helpers').logToFile;
const fs = require('fs');
const path = require('path');

module.exports = {
    emailLog
}

async function emailLog (data) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    let emailContents = {
        from: '"Portfolio Site" <chris.wernli@hotmail.com>',
        to: 'chris.wernli40@gmail.com',
        subject: 'PORTFOLIO SITE WEEKLY LOG',
        text: 'No Report file.'
    }

    if (fs.existsSync(path.join(process.cwd(), 'logs', 'error_log'))) {
        emailContents.text = 'Attached is the weekly report.';
        emailContents.attachments = [
            {
                path: path.join(process.cwd(), 'logs', 'error_log')
            }
        ]
    }

    let email = await transporter.sendMail(emailContents);

    fs.truncate(path.join(process.cwd(), 'logs', 'error_log'), 0, function (err, bytes) {
        log.error('error removing log data', err);
        custLog('error_log', err, 'error removing log data');
    })

    if (email.messageId) {
        return true;
    } else {
        log.error('email send error', email);
        custLog('error_log', email, 'email send error');
        return false;
    }
}