const router = require('express').Router();
const recaptchaService = require('./recaptcha-model');

router.post('/verify', (req, res) => {
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

module.exports = router;