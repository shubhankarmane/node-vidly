// Connect to mongodb
const mongoose = require('mongoose');

// Joi is for validation
const Joi = require('joi');

// Defining schema for a customer
const Customer = mongoose.model('Customer', 
    new mongoose.Schema({
        isGold: {
            type: Boolean,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        }
    }
));

function validateCustomer(customer) {
    //Joi verification of the request body
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().required(),
        phone: Joi.number().required()
    });
    const validationResult = schema.validate(customer);
    return validationResult;
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;