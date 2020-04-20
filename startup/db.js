const mongoose = require("mongoose");
const winston = require("winston")

function connectToVidlyMongoDB() {
  mongoose
    .connect("mongodb://localhost/vidly", { useFindAndModify: false })
    .then(() => winston.info('*** Connection successfully established with vidly app ***'));
}

module.exports = connectToVidlyMongoDB;
