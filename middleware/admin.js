module.exports = function(req, res, next) {
    if(!req.user.isAdmin) return res.status(403).send('Forbidden. You do not have access!');
    next();
}