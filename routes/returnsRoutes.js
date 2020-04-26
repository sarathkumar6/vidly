// POST /api/vidly/rentals/returns { customerId, movieID }

// Failure Cases
// Return 401 if client is not logged in
// Renturn 400 if customerId is not ptovided
// Return 400 if movieId is not provided
// Return 404  if no rental found for this customerId / movieId

// Success Cases
// Return 200 if valid request
// Set the return fdate
// Caculate the rental fee
// Increase the stock
// Return the rental

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Joi = require("@hapi/joi");
const { Rental } = require("../models/rental");
const validateReturns = Joi.object({
  customerId: Joi.string().required(),
  movieId: Joi.string().required()
});
router.post("/", auth, async (request, response) => {
  try {
    const validateRequest = validateReturns.validate(request.body);
    if (validateRequest.error) {
      return response
        .status(400)
        .send(validateRequest.error.details[0].message);
    }
    
    const rental = await Rental.findOne({
      'customer._id': request.body.customerId,
      'movie._id': request.body.movieId
    });

    if (!rental) return response.status(404).send("Rental not found");
    if (rental.dateReturned) return response.status(400).send("Return already processed");
  } catch (error) {
    return response.status(400).send(error.message);
  }
});

module.exports = router;
