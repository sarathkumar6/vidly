const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  isGold: Boolean
});
const movieSchema = new mongoose.Schema({
  title: String,
  dailyRentalRate: Number
});
const rentalSchema = new mongoose.Schema({
  customer: {type: customerSchema},
  movie: {type: movieSchema},
  dateRented: {type: Date, default: Date.now},
  dateReturned: {type: Date},
  rentalFee: {type: Number}
});
const Rental = mongoose.model("Rental", rentalSchema);
const Joi = require("@hapi/joi");
Joi.obejctId = require("joi-objectid")(Joi);
const addRentalSchema = Joi.object({
  customerId: Joi.obejctId().required(),
  movieId:  Joi.obejctId().required()
});
const updateMoviesSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .required(),
  numberInStock: Joi.number()
    .min(1)
    .required(),
  genreId: Joi.string().required(),
  dailyRentalRate: Joi.number()
    .min(1)
    .required()
});

exports.Rental = Rental;
exports.addRentalSchema = addRentalSchema;
exports.updateMoviesSchema = updateMoviesSchema;
