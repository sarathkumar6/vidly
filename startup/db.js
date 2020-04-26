const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

function connectToVidlyMongoDB() {
  const db = config.get("db");
  mongoose
    .connect(db, { useFindAndModify: false , useCreateIndex: true})
    .then(() =>
      winston.info(`*** Connection successfully established with ${db} app ***`)
    );
}

module.exports = connectToVidlyMongoDB;
