const Redis = require("ioredis");
require("dotenv").config();
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
redisClient.ping((err, result) => {
  if (err) {
    console.error("Error connecting to Redis:", err);
  } else {
    console.log("Connected to Redis:", result);
  }
});

module.exports = redisClient;
