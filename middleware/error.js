module.exports = function(err, req, res, next) {
    // Log the error
    return res.status(500).send('Something went wrong...');
}