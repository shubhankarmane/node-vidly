const config = require('config');

module.exports = function() {
    if (!config.get('jwtPvtKey')) {
        console.log('Fatal Error: No Auth Key!');
        process.exit(1);
    }
}
// We get the key from the local environment variable for generating tokens for authentication