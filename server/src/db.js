const { Pool } = require("pg");

let pool;

try {
  pool = new Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
  });

  console.log("Connected to the database");
} catch (e) {
  console.error(e);
}

module.exports = pool;
