const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const userRegistrationValidationCriteria = Joi.object({
  name: Joi.string()
    .min(6)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required()
});
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  isAdmin: Boolean
});
userSchema.methods.generateAuthToken = function generateAuthToken() {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey")); // jwt.sign(payload, secretKey);
  return token;
}
const User = mongoose.model("User", userSchema);

exports.userRegistrationValidationCriteria = userRegistrationValidationCriteria;
exports.User = User
exports.userSchema = userSchema;