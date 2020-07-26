const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth')

router.post('/', async(req, res, next) => {
    try {
        const validationResult = validateUser(req.body);
        if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
        
        // We first verify if a user has already been signed up or not
        let user = await User.findOne({ email: req.body.email });
        if(user) return res.status(400).send('User already registered');
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
    
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
    
        await user.save();
    
        // const token = user.generateAuthToken();
    
        // return res.header('x-auth-token', token).status(200).send(_.pick(user, ['id', 'name', 'email']));
    
        return res.send(_.pick(user, ['id', 'name', 'email']));
    }
    catch(ex) {
        next(ex);
    }
});

router.get('/me', auth, async(req, res, next) =>  {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    }
    catch(ex) {
        next(ex);
    }
});

module.exports = router;