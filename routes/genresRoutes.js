const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Genre, addGenresSchema, updateSchema } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get all the genres
router.get("/", async (request, response, next) => {
  //throw new Error('Retrieving genres failed');
  const genres = await Genre.find().sort("name");
  return response.send(genres);
});
// Get a specific genre
router.get("/:id", async (request, response) => {
  // ToDo: extract the params id check to middleware
  if (!_.eq(request.params.id.length, 3)) {
    return response.status(404).send("Invalid Genre Id");
  }
  const getTheGenre = await Genre.findOne({ genreId: request.params.id });
  return getTheGenre
    ? response.send(getTheGenre)
    : response.status(404).send("The genre id is not found");
});
// Add a genre
router.post("/", auth, async (request, response) => {
  try {
    const validateRequest = addGenresSchema.validate(request.body);
    if (validateRequest.error) 
      return response.status(400).send(validateRequest.error.details[0].message);

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
router.put("/", auth, async (request, response) => {
  // Useful doc: https://masteringjs.io/tutorials/mongoose/update
  try {
    updateSchema.validate(request.body);
    const getTheGenre = await Genre.findOne({
      genreId: _.capitalize(request.body.genreType.substr(0, 3))
    });
    await getTheGenre.updateOne({
      genreType: request.body.genreType,
      movies: request.body.movies
    });
    const updatedGenre = await Genre.findOne({
      genreId: _.capitalize(request.body.genreType.substr(0, 3))
    });
    response.send(updatedGenre);
  } catch (error) {
    return response.status(400).send(error.message);
  }
});
// Delete a Genre
router.delete("/:id", [auth, admin], async (request, response) => {
  // ToDo: Error Handling to throw Something failed seem to not work properly
  await Genre.deleteOne(
    {
      genreId: request.params.id
    },
    function callBack(err, result) {
      if (result) response.send(result);
      else if (err)
        response.status(400).send(new Error("Deleting a genre failed", err));
    }
  );
});

module.exports = router;
