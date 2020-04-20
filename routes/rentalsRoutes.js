const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Rental, addRentalSchema } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");
const Fawn = require("fawn");

// Pass the mongoose to init of Fawn
// Fawn implements the two-phase commit 
Fawn.init(mongoose);

// Get All Rentals
router.get("/", async (request, response) => {
  const rentals = await Rental.find().sort("-dateRented");
  response.send(rentals);
});

/* // Get A Rental
router.get("/:id", async (request, response) => {
  const getTheMovie = await Movie.findOne({ title: request.params.id });
  return getTheMovie
    ? response.send(getTheMovie)
    : response.status(404).send("The genre id is not found");
}); */

// Add A Rental
router.post("/", async (request, response) => {
  try {
    addRentalSchema.validate(request.body);
    console.log(request.body);
    // find the genre here from the genreId
    const findTheCustomer = await Customer.findById(request.body.customerId);
    if (!findTheCustomer) response.status(400).send("Invalid Customer Id");
    const findTheMovie = await Movie.findById(request.body.movieId);
    if (!findTheMovie) response.status(400).send("Invalid Movie Id");
    if (_.lte(findTheMovie.numberInStock, 0))
      response.status(400).send(" Movie is out of stock");
    let addARental = new Rental({
      customer: {
        _id: findTheCustomer._id,
        name: findTheCustomer.name,
        phone: findTheCustomer.phone
      },
      movie: {
        _id: findTheMovie._id,
        title: findTheMovie.title,
        dailyRentalRate: findTheMovie.dailyRentalRate
      }
    });
    /* addARental = await addARental.save();
    findTheMovie.numberInStock = findTheMovie.numberInStock - 1;
    await findTheMovie.save(); */
    new Fawn.Task()
      .save("rentals", addARental) //save( name of the collection, and the item)
      .update(
        "movies",
        { _id: findTheMovie._id },
        {
          $inc: { numberInStock: -1 } // ToDo: what is $inc
        }
      )
      .run(); // if this fails throw internal server error 500
    response.send(addARental);
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
