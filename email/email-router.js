const router = require('express').Router();
const emailService = require('./email-model');
const recaptchaService = require('../recaptcha/recaptcha-model');

router.post('/send', emailValidation, async (req, res) => {
    const data = req.body;

    if (data['g-recaptcha-response']) {
        let validation = await recaptchaService.verifyRecaptcha(data['g-recaptcha-response']);

        if (!validation.success || validation.bot) {
            return res.status(500).json({
                message: 'validation failed'
            })
        }
    }
    emailService.sendEmail(data).then(data => {
        if (data) {
            res.status(200).json({
                success: true
            })
        } else {
            res.status(500).json({
                message: 'error sending email'
            })
        }
    }).catch(() => {
        res.status(500).json({
            message: 'error sending email'
        })
    });
})

function emailValidation(req, res, next) {
    const data = req.body;

    if (!data.name || !data.email || !data.message) {
        res.status(400).json({
            message: 'missing required field(s)'
        })
    } else {
        next();
    }
}

module.exports = router;