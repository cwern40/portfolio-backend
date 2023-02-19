const nodemailer = require('nodemailer');
const log = require('loglevel');
const custLog = require('../helper/helpers').logToFile;
const writeFileToAWS  = require('../helper/helpers').writeFileToAWS;
const fs = require('fs');
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
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: logName,
    }).promise();
    log.error('s3 get error email log', file) 
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
                content: file?.Body || '',
            }
        ]
    }
    let test;
    try {
        test = file.Body.toString()
    }catch (err) {
        console.log(err)
    }

    let email = await transporter.sendMail(emailContents);

    if (email.messageId) {
        await s3.upload({
            Bucket: process.env.CYCLIC_BUCKET_NAME,
            Key: logName,
            Body: '',
        }).promise();
        return true;
    } else {
        log.error('email send error', email);
        custLog(logName, email, 'email send error');
        return false;
    }
}