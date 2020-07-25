const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    name: {
        required: true,
        type: String,
        minlength: 1,
        maxlength: 50
    },
    email: {
        required: true,
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        required: true,
        type: String,
        minlength: 8,
        maxlength: 1024
    }
}));

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;