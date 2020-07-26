const config = require('config');
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

const error = require('./middleware/error');

if (!config.get('jwtPvtKey')) {
    console.log('Fatal Error: No Auth Key!');
    process.exit(1);
}

// Connecting to mongodb once for the lifetime of the application
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true})
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
// Error handler for every route
app.use(error);

app.listen(3000, () => {
    console.log('Listening on server: localhost:3000/...')
});