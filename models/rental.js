const Joi = require('Joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        required: true,
        type: new mongoose.Schema({
            name: {
                required: true,
                type: String,
                maxlength: 255,
                minlength: 1
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: Number,
                required: true
            }
        })
    },
    movie: {
        required: true,
        type: new mongoose.Schema({
            title: {
              type: String,
              required: true,
              trim: true, 
              minlength: 1,
              maxlength: 255
            },
            dailyRentalRate: { 
              type: Number, 
              required: true,
              min: 10,
            }   
        })
    },
    dateRented: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    dateReturned: { 
        type: Date
    },
    rentalFee: { 
        type: Number, 
        min: 0
    }
}));

function validateRental(rental) {
    const schema = Joi.object({
        movieId: Joi.string().required(),
        customerId: Joi.string().required()
    });
    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental