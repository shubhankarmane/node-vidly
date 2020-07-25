const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

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
router.post('/', auth, async (req, res) => {
    const validationResult = validateGenre(req.body);

    if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
    
    // Saving the genre to the server and returning the genre to the requester
    let addGenre = new Genre({
        genre: req.body.genre
    });
    addGenre = await addGenre.save();
    return res.status(200).send(addGenre);
});

// For DELETE requests
router.delete('/:id', [auth, admin], async (req, res) => {
    // We do not verify if the object exists on the db, we delete it first using the id
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if(!genre) return res.status(400).send('No such genre exists.');

    return res.status(200).send(genre);
});

// For PUT requests
router.put('/:id', auth, async (req, res) => {
    const validatationResult = validateGenre(req.body);

    if(validatationResult.error) return res.status(400).send('Invalid data received.');
    
    // We do not verify if the object exists on the db, we update it first using the id
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        genre: req.body.genre
    }, { new: true });
    // The object with the 'new' property returns the updated object
    
    if(!genre) return res.status(404).send('Genre with the ID does not exist');

    res.send(genre);
});

module.exports = router;