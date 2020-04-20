const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: String,
    genre: {
      type: genreSchema,
      required: true
    },
    numberInStock: Number,
    dailyRentalRate: Number
  })
);
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const addMoviesSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .required(),
  numberInStock: Joi.number()
    .min(1)
    .required(),
  genreId: Joi.objectId()
    .required(),
  dailyRentalRate: Joi.number()
    .min(1)
    .required()
});
const updateMoviesSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .required(),
  numberInStock: Joi.number()
    .min(1)
    .required(),
  genreId: Joi.string()
    .required(),
  dailyRentalRate: Joi.number()
    .min(1)
    .required()
});

exports.Movie = Movie;
exports.addMoviesSchema = addMoviesSchema;
exports.updateMoviesSchema = updateMoviesSchema;
