const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Genre, addGenresSchema, updateSchema} = require('../models/genre');

// Get all the genres
router.get("/", async (request, response) => {
  const genres = await Genre.find().sort("name");
  copyOfGenres = _.cloneDeep(genres);
  response.send(genres);
});
// Get a specific genre
router.get("/:id", async (request, response) => {
  const getTheGenre = await Genre.findOne({genreId: request.params.id});
  return getTheGenre? response.send(getTheGenre) : response.status(404).send("The genre id is not found");
});
// Add a genre
router.post("/", async (request, response) => {
  try {
    addGenresSchema.validate(request.body);
    let addGenre = new Genre({
      genreType: request.body.genreType,
      genreId: _.capitalize(request.body.genreType.substr(0, 3)),
      movies: request.body.movies
    });
    addGenre = await addGenre.save();
    response.send(addGenre);
  } catch (error) {
    return response.status(400).send(error.message);
  }
});
// Update a Genre
router.put("/", async (request, response) => {
    // Useful doc: https://masteringjs.io/tutorials/mongoose/update
  try {
    updateSchema.validate(request.body);
    const getTheGenre = await Genre.findOne({genreId: _.capitalize(request.body.genreType.substr(0, 3))});
    await getTheGenre.updateOne({
      genreType: request.body.genreType,
      movies: request.body.movies
    });
    const updatedGenre = await Genre.findOne({genreId: _.capitalize(request.body.genreType.substr(0, 3))});
    response.send(updatedGenre);
  } catch (error) {
    return response.status(400).send(error.message);
  }
});
// Delete a Genre
router.delete("/:id", async (request, response) => {
  try {
    await Genre.deleteOne({
      genreId: request.params.id
    }, function callBack(err, result) {
        if (result) response.send(result);
        else if (err) new Error('Deleting a genre failed', err);
    });
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

module.exports = router;
