const winston = require('winston');

module.exports = function(err, req, res, next) {
    // Log the error
    winston.log(err.message, err);
    console.log(err.message);
    console.log(err);
    return res.status(500).send('Something went wrong...');
}