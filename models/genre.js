// Connect to mongodb
const mongoose = require('mongoose');

// Joi is for validation
const Joi = require('joi');

// Defining schema for a genre
const Genre = mongoose.model('Genre', 
    new mongoose.Schema({
        genre: {
            type: String,
            required: true,
        }
    }
));

function validateGenre(genre) {
    //Joi verification of the request body
    const schema = Joi.object({
        genre: Joi.string().required(),
    });
    const validationResult = schema.validate(genre);
    return validationResult;
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
