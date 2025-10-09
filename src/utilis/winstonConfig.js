const winston = require("winston");
const { combine, timestamp, json, colorize } = winston.format;

const filterError = winston.format((info) => {
  return info.level === "error" ? info : undefined;
});

const filterInfo = winston.format((info) => {
  return info.level === "info" ? info : undefined;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(colorize({ all: true }), json()),
  transports: [
    new winston.transports.File({
      filename: "./src/logs/error.log",

      format: combine(timestamp(), json(), filterError()),
    }),
    new winston.transports.File({
      filename: "./src/logs/other.log",

      format: combine(timestamp(), json(), filterInfo()),
    }),
  ],
});

module.exports = logger;
