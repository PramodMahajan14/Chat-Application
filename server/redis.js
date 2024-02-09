const Redis = require("ioredis");
require("dotenv").config();
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: EDIS_PORT,
});
redisClient.ping((err, result) => {
  if (err) {
    console.error("Error connecting to Redis:", err);
  } else {
    console.log("Connected to Redis:", result);
  }
});

module.exports = redisClient;

// redisClient.hset("user:id123", "username", "alice", function (err, reply) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("Set:", reply);
//   }
// });

// redisClient.hgetall("user:id123", function (err, reply) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log("Set:", reply);
//     redisClient.quit();
//   }
// });
