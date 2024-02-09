const { Pool } = require("pg");
require("dotenv").config();

// const connectionString = `postgres://${username}:${password}@${
//   your - remote - host
// }:${your - remote - port}/${your - remote - database}`;

const pool = new Pool({
  connectionString: process.env.DB_STRING,
});
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL,
    userid VARCHAR NOT NULL UNIQUE
    
  );
`;

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("Connected to remote PostgreSQL database");
    console.log("Current timestamp from the database:", res.rows[0].now);
  }
});

module.exports = pool;
