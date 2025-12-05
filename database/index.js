const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * *************** */

let config = {
  connectionString: process.env.DATABASE_URL,
};

// Add SSL for development environments
if (process.env.NODE_ENV == "development") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(config);

// Query function wrapper for logging in development
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    // if (process.env.NODE_ENV == "development") {
    //   console.log("executed query", { text });
    // }
    return res;
  } catch (error) {
    console.error("error in query", { text });
    throw error;
  }
};

module.exports = { query };