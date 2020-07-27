const express = require('express');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');

// For POST requests
router.post('/', auth, async(req, res, next) => {
    try {
        const validationResult = validateMovie(req.body);
        if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
        const getgenre = await Genre.findById(req.body.genreID);
        if(!getgenre) return res.status(400).send('Couldn\'t find genre!');
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
    }
    catch(ex) {
        next(ex);
    }
});

// For GET requests
router.get('/', async(req, res, next) => {
    try{
        const movies = await Movie.find();
        if(movies) 
            return res.status(200).send(movies);
        else
            return res.status(404).send('Couldn\'t find movies!');
    }
    catch(ex) {
        next(ex);
    }
});

router.get('/:id', async(req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id)
        if(!movie) {
            return res.status(404).send('Couldn\'t find movie!');
        }
        else {
            return res.status(200).send(movie);
        }
    }
    catch(ex) {
        next(ex);
    }
});

// For PUT Requests
router.put('/:id', auth, async(req,res, next) => {
    try {
        const validationResult = validateMovie(req.body);
        if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);
        const getgenre = await Genre.findById(req.body.genreID);
        if(!getgenre) return res.status(404).send('Couldn\'t find genre!');
        const movie = await Movie.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
            genre: getgenre
        }, {new:true});
        if (!movie) return res.status(404).send('Couldn\'t find movie!');
        res.send(movie);
    }
    catch(ex) {
        next(ex);
    }
});

// For DELETE Requests
router.delete('/:id', auth, async (req, res, next) => {
    try{
        const movie = await Movie.findByIdAndRemove(req.params.id);
        if (!movie) return res.status(404).send('Couldn\'t find movies!');
        res.send(movie);
    }
    catch(ex) {
        next(ex);
    }
});
  
module.exports = router; 