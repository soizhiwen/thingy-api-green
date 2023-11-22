const { Pool } = require("pg");
const pool = new Pool();

async function createPlantsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS plants
      (
        id SERIAL PRIMARY KEY, 
        name VARCHAR NOT NULL,
        harvest_date TIMESTAMP WITH TIME ZONE NOT NULL,
        temperature NUMERIC NOT NULL,
        humidity NUMERIC NOT NULL,
        co2 NUMERIC NOT NULL,
        airquality NUMERIC NOT NULL
      );
      `;

    await pool.query(query);
    console.log("Plants table created");
  } catch (err) {
    console.error(err);
    console.error("Plants table creation failed");
  }
}

async function createUsersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users
      (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        role VARCHAR NOT NULL
      );
      `;

    await pool.query(query);
    console.log("Users table created");
  } catch (err) {
    console.error(err);
    console.error("Users table creation failed");
  }
}

createPlantsTable();
createUsersTable();

module.exports = {
  pool,
};
