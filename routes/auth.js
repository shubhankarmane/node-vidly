const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async(req, res, next) => {
    try {
        const validationResult = validate(req.body);
        if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
        let user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(400).send('Invalid email or password');
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('Invalid email or password');
        // const token = jwt.sign({ _id: user._id }, config.get('jwtPvtKey'));
        const token = user.generateAuthToken();
        res.send(token);
    }
    catch(ex) {
        next(ex);
    }
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
}

module.exports = router;