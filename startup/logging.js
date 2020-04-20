require("winston-mongodb");
require("express-async-errors");
const winston = require("winston");

function startUpLogging() {
  process.on("uncaughtException", error => {
    winston.error(error.message, { metadata: error });
    process.exit(1);
  });

  process.on("unhandledRejection", error => {
    winston.error(error.message, { metadata: error });
    process.exit(1);
  });
  // Just to print on the console
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  );
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  );

  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info"
    })
  );
}

module.exports = startUpLogging;
