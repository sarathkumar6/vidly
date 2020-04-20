const express = require("express");
const genres = require("../routes/genresRoutes");
const customers = require("../routes/customersRoutes");
const movies = require("../routes/moviesRoutes");
const rentals = require("../routes/rentalsRoutes");
const users = require("../routes/userRoutes");
const auth = require("../routes/authRoutes");
const error = require("../middleware/error");

function startUpVidlyRoutes(app) {
  // Adding a piece of middleware to request pipeline to grab the request body
  app.use(express.json());

  app.use("/api/vidly/genres", genres);
  app.use("/api/vidly/customers", customers);
  app.use("/api/vidly/movies", movies);
  app.use("/api/vidly/rentals", rentals);
  app.use("/api/vidly/users", users);
  app.use("/api/vidly/auth", auth);
  app.use(error);

  app.listen(6000, () => console.log("Listening to port 6000"));
}

module.exports = startUpVidlyRoutes;
