const mongoose = require("mongoose");
const customerSchema = mongoose.Schema({
    isGold: Boolean,
    name: String,
    phone: String
  });

  module.exports = customerSchema;