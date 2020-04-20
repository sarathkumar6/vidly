/* 
    1. Create a class that holds movie genres information
    2. Create a genreConstants to get default genre
    3. Create a route to get a genre through genreId
*/
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const _ = require("lodash");
const express = require("express");
const vidlyApp = new express();
//require('./startup/routes')(vidlyApp);
const genres = require("./routes/genresRoutes");
const customers = require("./routes/customersRoutes");
const movies = require("./routes/moviesRoutes");
const rentals = require("./routes/rentalsRoutes");
const users = require("./routes/userRoutes");
const auth = require("./routes/authRoutes");
const Joi = require("@hapi/joi");
Joi.obejctId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");
const error = require("./middleware/error");

process.on('uncaughtException', (error) => {
    winston.error(error.message, { metadata: error});
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    winston.error(error.message, { metadata: error});
    process.exit(1);
});

// Just to print on the console
winston.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    coloriz: true,
    prettyPrint: true
  })
);
winston.add(
  new winston.transports.File({
    filename: "logfile.log",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
);

winston.add(
  new winston.transports.MongoDB({
    db: 'mongodb://localhost/vidly',
    level: 'info'
  })
);
/* const rejectPromise = Promise.reject(new Error('Something fucked up'));
rejectPromise
  .then(() => console.log("Rejection Done")); */
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost/vidly", { useFindAndModify: false })
  .then(() => winston.info("Connection established with vidly"))
  .catch(error1 => console.log("Connection to vidly failed", error1));

// Adding a piece of middleware to request pipeline to grab the request body
vidlyApp.use(express.json());

vidlyApp.use("/api/vidly/genres", genres);
vidlyApp.use("/api/vidly/customers", customers);
vidlyApp.use("/api/vidly/movies", movies);
vidlyApp.use("/api/vidly/rentals", rentals);
vidlyApp.use("/api/vidly/users", users);
vidlyApp.use("/api/vidly/auth", auth);
vidlyApp.use(error);

vidlyApp.listen(6000, () => console.log("Listening to port 6000"));
