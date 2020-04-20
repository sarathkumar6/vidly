module.exports = function() {
  const Joi = require("@hapi/joi");
  Joi.obejctId = require("joi-objectid")(Joi);
};
