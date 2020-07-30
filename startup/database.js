const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    // Connecting to mongodb once for the lifetime of the application
    const pwd = config.get('password')
    mongoose.set('useCreateIndex', true);
    mongoose.connect('mongodb+srv://shubhankar:'+pwd+'@shubhankar-cluster.0lyua.mongodb.net/vidly', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected!'))
        .catch(err => console.error('Connection Failed', err));
}