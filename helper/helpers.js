const fs = require('fs');
const path = require('path');
const AWS = require("aws-sdk");
const log = require('loglevel');
const s3 = new AWS.S3();
const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';
const filePath = process.env.APP_ENV == 'dev' ? path.join(process.cwd(), process.env.LOG_PATH, logName) : path.join(process.env.LOG_PATH, logName);

module.exports = {
    logToFile,
    writeFileToAWS
}

function logToFile(filename, data, title='') {
    if (typeof data != 'string') {
        try {
            data = JSON.stringify(data);
        } catch {
            data = data;
        }
    }
    
    let log = fs.createWriteStream(filePath, { flags: 'a' });

    log.on('open', function () {
        log.write(`${title}: ${data}`);
        log.end();
    })
}

async function writeFileToAWS(body='', fileName, append=false) {
    if (append) {
        try {
            let s3File = await s3.getObject({
                Bucket: process.env.CYCLIC_BUCKET_NAME,
                Key: fileName
            }).promise()
            body = s3File?.body?.toString() ? s3File.body.toString() + '\n' + body : body;
        } catch (err) {
            log.error('s3 get file error', err)
            logToFile(logName, err, 's3 get file error');
        }
        
    }
    if (fileName.includes('_log')) {
        let fileStream = fs.createReadStream(filePath)
        fileStream.on('error', function(err) {
            log.error('writeFileToAWS filestream error');
            logToFile(logName, err, 'writeFileToAWS filestream error');
        })

        body += fileStream;

        fs.truncate(filePath, 0, function (err, bytes) {
            if (err) {
                log.error('error removing log data', err);
                logToFile(logName, err, 'error removing log data');
            }
        })
    }

    return s3.upload({
        Bucket: process.env.CYCLIC_BUCKET_NAME,
        Key: fileName,
        Body: body,
    }, function (err, data) {
        if (err) {
            log.error(`s3 error uploading file - ${err}`);
            logToFile(logName, err, 's3 error uploading file');
            return {
                success: false,
                error: err
            }
        }
        if (data) {
            log.info(`s3 upload file success - ${data}`);
            return {
                success: true
            }
        }
    })
}