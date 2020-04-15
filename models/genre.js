const mongoose = require("mongoose");
const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema({
    genreId: String,
    genreType: String,
    movies: Array
  })
);
const Joi = require("@hapi/joi");
const addGenresSchema = Joi.object({
  genreType: Joi.string()
    .min(3)
    .required(),
  movies: Joi.array()
    .min(2)
    .required()
});
const updateSchema = Joi.object({
  genreType: Joi.string()
    .min(3)
    .required(),
  genreId: Joi.string()
    .min(3)
    .required(),
  movies: Joi.array()
    .min(2)
    .required()
});

exports.Genre = Genre;
exports.addGenresSchema = addGenresSchema;
exports.updateSchema = updateSchema;
