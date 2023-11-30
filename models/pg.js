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

async function createNotificationsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications
      (
        id SERIAL PRIMARY KEY,
        message VARCHAR NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        plant_id INTEGER REFERENCES plants NOT NULL
      );
      `;

    await pool.query(query);
    console.log("Notifications table created");
  } catch (err) {
    console.error(err);
    console.error("Notifications table creation failed");
  }
}

async function createNotificationSentTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notification_sent
      (
        notification_id INTEGER REFERENCES notifications NOT NULL,
        user_id INTEGER REFERENCES users NOT NULL,
        PRIMARY KEY (notification_id, user_id)
      );
      `;

    await pool.query(query);
    console.log("Notification sent table created");
  } catch (err) {
    console.error(err);
    console.error("Notification sent table creation failed");
  }
}

async function createNotificationViewsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notification_views
      (
        notification_id INTEGER REFERENCES notifications NOT NULL,
        user_id INTEGER REFERENCES users NOT NULL,
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

async function createTables() {
  await createPlantsTable();
  await createUsersTable();
  await createNotificationsTable();
  await createNotificationSentTable();
  await createNotificationViewsTable();
}

createTables();

module.exports = {
  pool,
};
