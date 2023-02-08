const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser')
require('dotenv').config();

const emailRouter = require('../email/email-router');
const recaptchaRouter = require('../recaptcha/recaptcha-router');

const server = express();

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(helmet());
server.use(cors());
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