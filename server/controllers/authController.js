const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { jwtSign, jwtVerify, getJwt } = require("../jwt/jwtAuth");

module.exports.handleLogin = (req, res) => {
  const token = getJwt(req);

  if (!token) {
    res.json({ loggedIn: false });
    return;
  }
  jwtVerify(token, process.env.JWT_SECRET)
    .then((token) => {
      res.json({ loggedIn: true, token });
    })
    .catch((err) => {
      res.json({ loggedIn: false });
    });
};

module.exports.attemptLogin = async (req, res) => {
  try {
    const potentialLogin = await pool.query(
      "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
      [req.body.username]
    );

    if (potentialLogin.rowCount > 0) {
      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].passhash
      );
      if (isSamePass) {
        jwtSign(
          {
            username: req.body.username,
            id: potentialLogin.rows[0].id,
            userid: potentialLogin.rows[0].userid,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2min" }
        )
          .then((token) => {
            res.json({ loggedIn: true, token });
          })
          .catch((err) => {
            res.json({
              loggedIn: false,
              status: "Somthing went wrong, try again",
            });
          });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
      }
    } else {
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  } catch (err) {
    res.json({ loggedIn: false, status: "server Error" });
  }
};

module.exports.attemptRegister = async (req, res) => {
  const existingUser = await pool.query(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUser.rowCount === 0) {
    // register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      "INSERT INTO users(username, passhash, userid) values($1,$2,$3) RETURNING id, username, userid",
      [req.body.username, hashedPass, uuidv4()]
    );

    jwtSign(
      {
        username: req.body.username,
        id: newUserQuery.rows[0].id,
        userid: newUserQuery.rows[0].userid,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2min" }
    )
      .then((token) => {
        res.json({ loggedIn: true, token });
      })
      .catch((err) => {
        res.json({
          loggedIn: false,
          status: "Somthing went wrong, try again",
        });
      });
  } else {
    res.json({ loggedIn: false, status: "Username taken" });
  }
};
