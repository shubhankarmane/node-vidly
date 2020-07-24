const express = require('express');
const router = express.Router();
const {Rental, validateRental} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const Fawn = require('fawn');
const mongoose = require('mongoose');

Fawn.init(mongoose);

router.post('/', async(req, res) => {
    const validationResult = validateRental(req.body);
    if(validationResult.error) return res.status(400).send(validationResult.error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid Customer');

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid Movie');

    if(movie.numberInStock === 0) return res.send('Out of stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    // Using fawn to simulate 2 phase commit as mongodb does not support transaction 
    try {
        new Fawn.Task().save('rentals', rental).update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        }).run();
        res.send(rental);
    }
    catch(ex) {
        return res.status(500).send('Internal server error.');
    }
});

router.get('/', async(req, res) => {
    const rentals = await Rental.find();
    if(!rentals) return res.status(400).send('No rentals found');
    return res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
  
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  
    res.send(rental);
});

module.exports = router;