const winston = require('winston');
const express = require('express');
const app = express();
const Joi = require('Joi');
Joi.objectId = require('joi-objectid')(Joi);
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/configKey')();
require('./startup/prod')();
// Handling errors that are outside the scope of express 
// (errors other than those that occur when handling routes) 
process.on('uncaughtException', (ex) => {
    console.log('Uncaught exception occurred: ', ex);
    winston.error(ex.message, ex);
})
winston.add(new winston.transports.File({ filename: 'logfile.log' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Listening on server: localhost:3000/...')
});