const router = require('express').Router();
const cronJobService = require('./cron-model');
const helperService = require('../helper/helpers');
const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';

router.get('/emaillog', cronValidation, (req, res) => {
    cronJobService.emailLog().then(data => {
        if (data) {
            res.status(200).json({
                success: true
            })
        } else {
            res.status(500).json({
                message: 'error sending log'
            })
        }
    }).catch((err) => {
        res.status(500).json({
            message: 'error sending log',
            error: err
        })
    })
})

router.get('/uploadlog', cronValidation, (req, res) => {
    helperService.writeFileToAWS('', logName, true).then(data => {
        if (data.success) {
            res.status(200).json({
                success: true
            })
        } else {
            res.status(500).json({
                message: 'error uploading log to aws',
                error: data.error
            })
        }
    }).catch((err) => {
        res.status(500).json({
            message: 'error uploading log to aws',
            error: err
        })
    })
})

function cronValidation (req, res, next) {
    if (req.headers?.['x-cyclic'] == 'cron') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

module.exports = router;