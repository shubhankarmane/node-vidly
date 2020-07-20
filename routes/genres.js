const express = require('express');
const router = express.Router();
// Joi is for validation
const Joi = require('joi');

// Connect to mongodb
const mongoose = require('mongoose');

// Defining schema for a genre
const Genre = mongoose.model('Genre', 
    new mongoose.Schema({
        genre: {
            type: String,
            required: true,
        }
    }
));

// const genres = [
//     { id: 1, genre: 'Action' },
//     { id: 2, genre: 'Horror' },
//     { id: 3, genre: 'Sci-Fi' },
//     { id: 4, genre: 'Romance' },
//     { id: 5, genre: 'Comedy' },
//     { id: 6, genre: 'Crime' },
//     { id: 7, genre: 'Adventure' },
//     { id: 8, genre: 'Drama' },
//     { id: 9, genre: 'Thriller' },
//     { id: 10, genre: 'Animation' },
// ];

// for GET requests
router.get('/', async (req, res) => {
    // sort the genres by their name and send it to the requester
    const genres = await Genre.find().sort('genre');
    if(genres) {
        return res.status(200).send(genres);
    }
    else {
        return res.status(400).send('Bad Request, No Genres Found!');
    }
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id).catch(err => {
        res.status(404).send('Doesn\'t exist');
    });

    if(!genre) {
        return res.status(400).send('Bad Request, Invalid ID');
    }
    else {
        return res.status(200).send(genre);
    }
});

// For POST requests
router.post('/', async (req, res) => {
    // Validation for the request body
    const schema = Joi.object({
        genre: Joi.string().required(),
    });
    const validationResult = schema.validate(req.body);
    // End of validation

    if(validationResult.error) {
        return res.status(400).send('Genre is invalid.');
    }
    else {
        // Saving the genre to the server and returning the genre to the requester
        let addGenre = new Genre({
            genre: req.body.genre
        });
        addGenre = await addGenre.save();
        return res.status(200).send(addGenre);
    }
});

// For DELETE requests
router.delete('/:id', async (req, res) => {
    // We do not verify if the object exists on the db, we delete it first using the id
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) {
        return res.status(400).send('No such genre exists.');
    }

    return res.status(200).send(genre);
});

// For PUT requests
router.put('/:id', async (req, res) => {
    // Validating the genre from the request body
    const schema = Joi.object({
        genre: Joi.string().required(),
    });
    const validatationResult = schema.validate(req.body);
    if(validatationResult.error) {
        return res.status(400).send('Invalid data received.');
    }
    
    // We do not verify if the object exists on the db, we update it first using the id
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        genre: req.body.genre
    }, { new: true });
    // The object with the 'new' property returns the updated object
    
    if(!genre) return res.status(404).send('Genre with the ID does not exist');

    res.send(genre);
});

module.exports = router;