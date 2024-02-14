const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSign = (payload, secret, options) =>
  new Promise((resovle, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resovle(token);
    });
  });

const jwtVerify = (token, secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      resolve(token);
    });
  });

const getJwt = (req) => {
  req.headers["authorization"]?.split(" ")[1];
};

module.exports = { jwtSign, jwtVerify, getJwt };
