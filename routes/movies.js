const express = require('express');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');

// For POST requests
router.post('/', async(req, res) => {
    const validationResult = validateMovie(req.body);
    if(validationResult.error) return res.status(400).send('error in validating movie');

    const getgenre = await Genre.findById(req.body.genreID);
    if(!getgenre) return res.status(400).send('No Genre Found');

    let movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: getgenre._id,
            genre: getgenre.genre
        }
    });
    await movie.save();
    return res.send(movie);
});

// For GET requests
router.get('/', async(req, res) => {
    const movies = await Movie.find();
    if(movies) 
        return res.status(200).send(movies);
    else
        return res.status(404).send('No Movie Found');
});
router.get('/:id', async(req, res) => {
    const movie = await Movie.findById(req.params.id).catch(err => {
        res.status(404).send('Doesn\'t exist');
    });

    if(!movie) {
        return res.status(400).send('Bad Request, Invalid ID');
    }
    else {
        return res.status(200).send(movie);
    }
});

// For PUT Requests
router.put('/:id', async(req,res) => {
    const validationResult = validateMovie(req.body);
    if(validationResult.error) return res.status(404).send(validationResult.error.details[0].message);

    const getgenre = await Genre.findById(req.body.genreID);
    if(!getgenre) return res.status(404).send('No Genre Found');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: getgenre
    }, {new:true});

    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
});

// For DELETE Requests
router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id).catch(err => {
        return res.send(err);
    });
  
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
    res.send(movie);
});
  
module.exports = router; 