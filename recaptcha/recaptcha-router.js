const router = require('express').Router();
const recaptchaService = require('./recaptcha-model');

router.post('/verify', recaptchaValidation, (req, res) => {
    const { token } = req.body;

    recaptchaService.verifyRecaptcha(token).then((data) => {
        if (data.success) {
            res.send(data)
        } else {
            res.status(500).json({
                message: "Unable to verify recaptcha token",
                error: error
            })
        }
    }).catch((err) => {
        console.log('error', err)
        res.status(500).json({
            message: "Unable to verify recaptcha token"
        })
    });
})

function recaptchaValidation(req, res, next) {
    const { token } = req.body;

    if (token) {
        next();
    } else {
        res.status(400).json({
            message: 'recaptcha token is required'
        })
    }
}

module.exports = router;