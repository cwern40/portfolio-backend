const router = require('express').Router();
const cronJobService = require('./cron-model');

router.get('/emaillog', emailLogValidation, (req, res) => {
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
            message: 'error sending log'
        })
    })
})

function emailLogValidation (req, res, next) {
    if (req.headers?.['x-cyclic'] == 'cron') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

module.exports = router;