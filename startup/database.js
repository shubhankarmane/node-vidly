const mongoose = require('mongoose');

module.exports = function() {
    // Connecting to mongodb once for the lifetime of the application
    mongoose.set('useCreateIndex', true);
    mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected!'))
        .catch(err => console.error('Connection Failed', err));
}