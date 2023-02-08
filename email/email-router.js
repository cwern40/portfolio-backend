const router = require('express').Router();
const emailService = require('./email-model');

router.post('/send', (req, res) => {
    const data = req.body;

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
    }).catch(data => {
        console.log('error', data)
        res.status(500).json({
            message: 'error sending email'
        })
    });
})

module.exports = router;