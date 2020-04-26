/* 
    1. Create a class that holds movie genres information
    2. Create a genreConstants to get default genre
    3. Create a route to get a genre through genreId
*/
const _ = require("lodash");
const winston = require("winston");
const express = require("express");
const vidlyApp = new express();
require("./startup/logging")();
require('./startup/routes')(vidlyApp);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
//require('./startup/prod')();

const Joi = require("@hapi/joi");
Joi.obejctId = require("joi-objectid")(Joi);

const port = process.env.PORT || 6000;
const server = vidlyApp.listen(port, () => winston.info(`Listening to ${port} now`))
module.exports = server;
/* const mongoose = require("mongoose");
const config = require("config");
const error = require("./middleware/error"); */
// ToDo: uncaught exceptions don't seem to log
/* process.on('uncaughtException', (error) => {
    winston.error(error.message, { metadata: error});
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    winston.error(error.message, { metadata: error});
    process.exit(1);
});

const rejectPromise = Promise.reject(new Error('Something fucked up'));
rejectPromise
  .then(() => console.log("Rejection Done")); 

  if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}*/

