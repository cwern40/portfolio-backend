const fs = require('fs');
const path = require('path');
const AWS = require("aws-sdk");
const log = require('loglevel');
const s3 = new AWS.S3();
const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';

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
    
    let log = fs.createWriteStream(path.join(process.cwd(), process.env.LOG_PATH, filename), { flags: 'a' });

    log.on('open', function () {
        log.write(`${title}: ${data}`);
        log.end();
    })
}

async function writeFileToAWS(body='', fileName, append=false) {
    if (append) {
        try {
            await s3.getObject({
                Bucket: process.env.S3_BUCKET,
                Key: fileName
            }).promise()
            body = data.body.toString() + '\n' + body;
        } catch (err) {
            log.error('s3 get file error', err)
            logToFile(logName, err, 's3 get file error');
        }
        
    }
    if (fileName.includes('_log')) {
        let fileStream = fs.createReadStream(path.join(process.cwd(), process.env.LOG_PATH, fileName))
        fileStream.on('error', function(err) {
            log.error('writeFileToAWS filestream error');
            logToFile(logName, err, 'writeFileToAWS filestream error');
        })

        body += fileStream;

        fs.truncate(path.join(process.cwd(), process.env.LOG_PATH, fileName), 0, function (err, bytes) {
            if (err) {
                log.error('error removing log data', err);
                logToFile(logName, err, 'error removing log data');
            }
        })
    }

    return s3.upload({
        Bucket: process.env.S3_BUCKET,
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