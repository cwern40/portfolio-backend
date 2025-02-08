const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const fs = require('fs');
// const path = require('path');
const moment = require('moment-timezone');
require('dotenv').config();
// const logName = process.env.APP_ENV == 'dev' ? 'error_log_dev' : 'error_log';
// const filePath = process.env.APP_ENV == 'dev' ? path.join(process.cwd(), process.env.LOG_PATH, logName) : path.join(process.env.LOG_PATH, logName);
// const accessLogStream = fs.createWriteStream(filePath, { flags: 'a'});

const emailRouter = require('../email/email-router');
const recaptchaRouter = require('../recaptcha/recaptcha-router');
const cronRouter = require('../cronjobs/cron-router');

const server = express();

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(helmet());
const corsOptions = {
    origin: 'https://chriswernli.com',
    optionsSuccessStatus: 200
}
server.use(cors(corsOptions));

// logger settings
// morgan.token('body', function (req, res) { return JSON.stringify(req.body)});
// morgan.token('date', function (req, res, tz) { return moment.tz(tz).format('ddd, MMM Do YYYY, h:mm:ss a zz'); });
// const logFormat = ':remote-addr - :remote-user [:date[America/Denver]] ":method :url HTTP/:http-version" :status :body :res[content-length] ":referrer" ":user-agent"';

// logs errors to the console
// server.use(morgan(logFormat, {
//     skip: function (req, res) { return res.statusCode < 400 }
// }))
server.use(express.json());

server.use('/api/email', emailRouter);
server.use('/api/recaptcha', recaptchaRouter);
server.use('/api/cron', cronRouter);

server.get('/', (req, res) => {
    res.send("Success")
})
server.use(function(req, res) {
    res.status(404).send('Route not found');
})

module.exports = server;