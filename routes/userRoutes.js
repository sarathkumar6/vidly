const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  User,
  userRegistrationValidationCriteria,
  userSchema
} = require("../models/user");
const bcrypt = require("bcrypt");

// Create a GET api/vidly/users to get registered users
router.get("/", async (request, response) => {
  try {
    const getUser = await User.find()
    .select(["name", "isAdmin"])
    .and({isAdmin: true});
    response.send(getUser);
  } catch (error) {
    response.status(400).send(error);
  }
});

// Create a GET api/vidly/users/me to get the registered user
router.get("/me", auth, async(request, response) => {
    const findUser = await User.findById(request.user._id).select(['name']);
    response.send(findUser)
})
// Create a POST api/vidly/users to register users
router.post("/", async (request, response) => {
    try {
      const validationResult = userRegistrationValidationCriteria.validate(request.body);
      const { error } = validationResult;
      const isAlreadyRegistered =  await User.findOne({ email: request.body.email});
      if (error) response.status(400).send(error.details);
      else if (isAlreadyRegistered) response.status(400).send("User already registered")
      else {
        let registerAUser = new User(_.pick(request.body,['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(8);
        registerAUser.password = await bcrypt.hash(registerAUser.password, salt);
        registerAUser = await registerAUser.save();
        response
        .header('x-auth-token', registerAUser.generateAuthToken())
        .send(_.pick(registerAUser, ['name', 'email', '_id']));
      }
    } catch (error) {
      console.log(error);
    }
  });
  

module.exports = router;
