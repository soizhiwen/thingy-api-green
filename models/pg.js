/**
 * This file handles the connection to and initialization of the PostgreSQL and the required tables.
 */



// Creating a PostgreSQL-Client
const { Pool } = require("pg");
const pool = new Pool();

/**
 * Create the Plants Table, if not yet present.
 */
async function createPlantsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS plants
      (
        id SERIAL PRIMARY KEY, 
        name VARCHAR NOT NULL,
        harvest_date TIMESTAMP WITH TIME ZONE NOT NULL,
        min_temperature NUMERIC NOT NULL,
        max_temperature NUMERIC NOT NULL,
        min_humidity NUMERIC NOT NULL,
        max_humidity NUMERIC NOT NULL,
        min_co2 NUMERIC NOT NULL,
        max_co2 NUMERIC NOT NULL,
        min_air_quality NUMERIC NOT NULL,
        max_air_quality NUMERIC NOT NULL
      );
      `;

    await pool.query(query);
    console.log("Plants table created");
  } catch (err) {
    console.error(err);
    console.error("Plants table creation failed");
  }
}

/**
 * Create the Users Table, if not yet present.
 */
async function createUsersTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users
      (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
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

/**
 * Create the Notification Table, if not yet present.
 */
async function createNotificationsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications
      (
        id SERIAL PRIMARY KEY,
        message VARCHAR NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        plant_id INTEGER REFERENCES plants ON DELETE CASCADE NOT NULL 
      );
      `;

    await pool.query(query);
    console.log("Notifications table created");
  } catch (err) {
    console.error(err);
    console.error("Notifications table creation failed");
  }
}

async function createNotificationViewsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notification_views
      (
        notification_id INTEGER REFERENCES notifications ON DELETE CASCADE NOT NULL,
        user_id INTEGER REFERENCES users ON DELETE CASCADE NOT NULL,
        viewed BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY (notification_id, user_id)
      );
      `;

    await pool.query(query);
    console.log("Notification views table created");
  } catch (err) {
    console.error(err);
    console.error("Notification views table creation failed");
  }
}

/**
 * 'One function to call then all!'
 * Calls all the table creation functions.
 */
async function createTables() {
  await createPlantsTable();
  await createUsersTable();
  await createNotificationsTable();
  await createNotificationViewsTable();
}

createTables();

module.exports = {
  pool
}
