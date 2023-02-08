const router = require('express').Router();
const emailService = require('./email-model');

router.post('/send', (req, res) => {
    const data = req.body;

    emailService.sendEmail(data);
})

module.exports = router;