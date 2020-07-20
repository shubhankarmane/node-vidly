const express = require('express');
const app = express();
const genres = require('./routes/genres');


// Connecting to mongodb once for the lifetime of the application
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected!'))
    .catch(err => console.error('Connection Failed', err));

app.use(express.json());
app.use('/api/genres', genres);

app.listen(3000, () => {
    console.log('Listening on server: localhost:3000...')
});