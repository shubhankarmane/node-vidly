const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const auth = require('../middleware/auth');
const {Movie} = require('../models/movie');

router.post('/:id', auth, async(req, res, next) => {
    try {
        const pre = await Rental.findById(req.params.id);
        if(!pre) return res.status(404).send('Couldn\'t find rental');
        if(pre.rentalFee) return res.status(409).send('Already returned!');
        pre.dateReturned = new Date();
        pre.rentalFee = calculateTotalRent(pre.dateRented, pre.dateReturned, pre.movie.dailyRentalRate)
        const rental = await Rental.findByIdAndUpdate(req.params.id, pre, {new:true});
        const movie = await Movie.findById(pre.movie._id);
        movie.numberInStock++;
        await movie.save();
        return res.send(rental);
    }
    catch(ex) {
        next(ex);
    }
});

function calculateTotalRent(dateRented, dateReturned, dailyRentalRate) {
    let days = Math.ceil(Math.abs(dateReturned.getTime() - dateRented.getTime()) / (1000 * 3600 * 24));
    return days * dailyRentalRate;
}
module.exports = router;