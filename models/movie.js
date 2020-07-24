// Connect to mongodb
const mongoose = require('mongoose');

// Joi is for validation
const Joi = require('joi');

const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
        minlength: 1
    },
    numberInStock: {
        type: Number,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        min: 10,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    }
}));

function validateMovie(movie) {
    //Joi verification of the request body
    const schema = Joi.object({
        title: Joi.string().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required(),
        genreID: Joi.objectId().required(),
    });
    return schema.validate(movie); 
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;