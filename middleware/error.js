const winston = require("winston");
function errorHandler(err, request, response, next) {
    // Types of level: error, warn, info, verbose, debug, silly
    winston.error(err.message, {metadata: err});
    response.status(500).send('Something failed.....');
}

module.exports = errorHandler;