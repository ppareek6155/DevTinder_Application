const Redis = require("ioredis");

const redisConnection = new Redis({
  port: 6379,
  host: "127.0.0.1",
  maxRetriesPerRequest: null,
});

module.exports = redisConnection;
