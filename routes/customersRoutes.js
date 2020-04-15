const _ = require("lodash");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const customerSchema = require('../models/customer');
const Customer = mongoose.model("Customer", customerSchema);
 /*
  ToDo: Add API Validations using Joi 
  Link about Mongoose Schem Type properties: 
  https://blog.cloudboost.io/everything-you-need-to-know-about-mongoose-63fcf8564d52
 */

 // Get all customers
router.get("/", async (request, response) => {
  const customers = await Customer.find().sort("name");
  response.send(customers);
});
// Get a Customer
router.get("/:id", async (request, response) => {
  const customer = await Customer.findOne({ name: request.params.id });
  return customer
    ? response.send(customer)
    : response.status(400).send("Invalid customer name");
});
// Update a Customer
router.put("/:id", async (request, response) => {
  try {
    const findTheCustomer = await Customer.findOne({ name: request.params.id });
    await findTheCustomer.updateOne({
      idGold: request.body.isGold,
      phone: request.body.phone
    });
    const findTheUpdatedCustomer = await Customer.findOne({
      name: request.params.id
    });
    return findTheUpdatedCustomer
      ? response.send(findTheUpdatedCustomer)
      : response.send("Updating a customer failed");
  } catch (error) {
    response.status(400).send(error.message);
  }
});
// Add a Customer
router.post("/", async (request, response) => {
  try {
    let addACustomer = new Customer({
      name: request.body.name,
      isGold: request.body.isGold,
      phone: request.body.phone
    });
    addACustomer = await addACustomer.save();
    response.send(addACustomer);
  } catch (error) {
    return response.status(400).send(error.message);
  }
});
// Delete a Customer
router.delete("/:id", async (request, response) => {
  try {
    await Customer.deleteOne({
        name: request.params.id
      }, function callBack(err, result) {
          if (result) response.send(result);
          else if (err) new Error('Deleting a customer failed', err);
      });
  } catch (error) {
    response.status(400).send(error.message);
  }
});
module.exports = router;
