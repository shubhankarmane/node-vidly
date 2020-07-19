const express = require('express');
const app = express();
const genres = require('./routes/genres');

app.use(express.json());
app.use('/api/genres', genres);

app.listen(3000, () => {
    console.log('Listening on server: localhost:3000...')
});