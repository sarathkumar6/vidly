const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

// Create a GET api/vidly/users to get registered users
router.get("/", async (request, response) => {
  try {
    const getUser = await User.find().select("name");
    response.send(getUser);
  } catch (error) {
    response.status(400).send(error);
  }
});

const userAuthenticationCriteria = Joi.object({
  email: Joi.string()
    .min(6)
    .required()
    .email(),
  password: Joi.string()
    .min(6)
    .required()
});
// Create a POST api/vidly/users to register users
router.post("/", async (request, response) => {
  try {
    const validationResult = userAuthenticationCriteria.validate(request.body);
    const { error } = validationResult;
    const user = await User.findOne({
      email: request.body.email
    });
    if (error) response.status(400).send(error.details);
    else if (!user) response.status(400).send("invalid email or password");
    else {
      const validatePassword = await bcrypt.compare(
        request.body.password,
        user.password
      );
      if (!validatePassword)
        response.status(400).send("invalid email or password");
      else {
        /* const token = jwt.sign({_id: user._id}, config.get("jwtPrivateKey")); // jwt.sign(payload, secretKey) */
        response.send(user.generateAuthToken());
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
