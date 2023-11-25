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
        air_quality NUMERIC NOT NULL
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
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
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

async function createNotificationsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications
      (
        id SERIAL PRIMARY KEY,
        message VARCHAR NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        plant_id INTEGER REFERENCES plants
      );
      `;

    await pool.query(query);
    console.log("Notifications table created");
  } catch (err) {
    console.error(err);
    console.error("Notifications table creation failed");
  }
}

async function createTables() {
  await createPlantsTable();
  await createUsersTable();
  await createNotificationsTable();
}

createTables();

module.exports = {
  pool,
};
