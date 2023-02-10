const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const emailRouter = require('../email/email-router');
const recaptchaRouter = require('../recaptcha/recaptcha-router');

const server = express();

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(helmet());
const corsOptions = {
    origin: 'https://chriswernli.com',
    optionsSuccessStatus: 200
}
server.use(cors(corsOptions));
server.use(module('dev', {
    skip: function (req, res) { return res.statusCode < 400 }
}))
server.use(express.json());

server.use('/api/email', emailRouter);
server.use('/api/recaptcha', recaptchaRouter);

server.get('/', (req, res) => {
    res.send("Success")
})
server.use(function(req, res) {
    res.status(404).send('Route not found');
})

module.exports = server;