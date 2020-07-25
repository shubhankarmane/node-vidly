const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async(req, res) => {
    const validationResult = validateUser(req.body);
    if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
    
    // We first verify if a user has already been signed up or not
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();
    return res.status(200).send(_.pick(user, ['id', 'name', 'email']));
});

module.exports = router;