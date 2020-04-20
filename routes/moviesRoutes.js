const _ = require("lodash");
const express = require("express");
const router = express.Router();
const {
  Movie,
  addMoviesSchema,
  updateMoviesSchema
} = require("../models/movie");
const { Genre } = require("../models/genre");

// Get All Movies
router.get("/", async (request, response) => {
  const movies = await Movie.find().sort("title");
  copyOfMovies = _.cloneDeep(movies);
  response.send(movies);
});

// Get A Movie
router.get("/:id", async (request, response) => {
  const getTheMovie = await Movie.findOne({ title: request.params.id });
  return getTheMovie
    ? response.send(getTheMovie)
    : response.status(404).send("The genre id is not found");
});

// Add A Movie
router.post("/", async (request, response) => {
  try {
    addMoviesSchema.validate(request.body);
    console.log(request.body);
    // find the genre here from the genreId
    const identifiedGenre = await Genre.findById(request.body.genreId);
    // ToDo: can this be a const???
    let addMovie = new Movie({
      title: request.body.title,
      numberInStock: request.body.numberInStock,
      dailyRentalRate: request.body.dailyRentalRate,
      genre: {
        _id: identifiedGenre._id,
        genreType: identifiedGenre.genreType,
        movies: identifiedGenre.movies
      }
    });
    addMovie = await addMovie.save();
    response.send(addMovie);
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

// Update A Movie
router.put("/:id", async (request, response) => {
  try {
    updateMoviesSchema.validate(request.body);
    const getTheMovie = await Movie.findOne({ title: request.params.id });
    console.log(getTheMovie);
    await getTheMovie.updateOne({
      title: request.params.id,
      numberInStock: request.body.numberInStock,
      dailyRentalRate: request.body.dailyRentalRate
    });
    const updatedMovie = await Movie.findOne({ title: request.params.id });
    response.send(updatedMovie);
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

// Delete A Movie
router.delete("/:id", async (request, response) => {
  try {
    await Movie.deleteOne(
      {
        title: request.params.id
      },
      function callBack(err, result) {
        if (result) response.send(result);
        else if (err) new Error("Deleting a movie failed", err);
      }
    );
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

module.exports = router;
