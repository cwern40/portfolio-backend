const nodemailer = require('nodemailer');
const log = require('loglevel');
const custLog = require('../helper/helpers').logToFile;
const writeFileToAWS  = require('../helper/helpers').writeFileToAWS;
const fs = require('fs');
const path = require('path');
const AWS = require("aws-sdk");
const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';
const s3 = new AWS.S3();

module.exports = {
    emailLog
}

async function emailLog (data) {
    log.info('start')
    await writeFileToAWS('', logName, true);
    let file = await s3.getObject({
        Bucket: process.env.S3_BUCKET,
        Key: logName,
    }).promise();
    log.error('s3 get error', file) 
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

    if (file) {
        emailContents.text = 'Attached is the weekly report.';
        emailContents.attachments = [
            {
                filename: 'error_log.txt',
                content: file
            }
        ]
    }

    let email = await transporter.sendMail(emailContents);

    fs.truncate(path.join(process.cwd(), process.env.LOG_PATH, logName), 0, function (err, bytes) {
        log.error('error removing log data', err);
        custLog(logName, err, 'error removing log data');
    })

    if (email.messageId) {
        return true;
    } else {
        log.error('email send error', email);
        custLog(logName, email, 'email send error');
        return false;
    }
}