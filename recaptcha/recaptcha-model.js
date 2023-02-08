const axios = require('axios');

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
            console.log('error', data);
            return { success: false, bot: undefined };
        }
    }).catch((err) => {
        console.log(err);
        return { success: false, bot: undefined };
    })
}