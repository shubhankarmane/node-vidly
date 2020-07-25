const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const Joi = require('Joi');
Joi.objectId = require('joi-objectid')(Joi);

// Connecting to mongodb once for the lifetime of the application
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected!'))
    .catch(err => console.error('Connection Failed', err));

app.use(express.json());

// Specifying the routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.listen(3000, () => {
    console.log('Listening on server: localhost:3000...')
});