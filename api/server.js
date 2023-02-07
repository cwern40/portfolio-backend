const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const emailRouter = require('../email/email-router');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/api/email', emailRouter);

server.get('/', (req, res) => {
    res.send("Success")
})

module.exports = server;