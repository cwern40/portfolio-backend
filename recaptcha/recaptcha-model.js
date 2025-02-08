const axios = require('axios');
const log = require('loglevel');
// const custLog = require('../helper/helpers').logToFile;
const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';

module.exports = {
    verifyRecaptcha
}

async function verifyRecaptcha (token) {
    return axios.post('https://www.google.com/recaptcha/api/siteverify', { secret: process.env.RECAPTCHA_SECRET, response: token}, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(({ data }) => {
        if (data.success) {
            if (data.score > .5) {
                return { success: true, bot: false };
            } else {
                return { success: true, bot: true };
            }
        } else {
            log.error('recaptcha validation error', data);
            // custLog(logName, data, 'recaptcha error');
            return { success: false, bot: undefined };
        }
    }).catch((err) => {
        log.error('recaptcha validation error', err);
        // custLog(logName, err, 'recaptcha error');
        return { success: false, bot: undefined };
    })
}