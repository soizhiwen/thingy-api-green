/**
 * This files interfaces with the database regarding notifications.
 */



const format = require("pg-format");
const { pool } = require("../models/pg");

/**
 * Retrieves all notifications from the database.
 *
 * @returns {Promise<{body, status: number}|{body: *, status: number}>}
 */
async function dbListNotifications() {
  try {
    const query = "SELECT * FROM notifications ORDER BY id DESC;";
    const { rows } = await pool.query(query);
    return { status: 200, body: rows };
  } catch (err) {
    return { status: 500, body: err };
  }
}

/**
 * Retrieves a specific notification defined by its 'id'.
 *
 * @param id - notification id
 * @returns {Promise<{body, status: number}|{body: string, status: number}|{body: *, status: number}>}
 */
async function dbGetNotificationById(id) {
  try {
    const query = {
      text: "SELECT * FROM notifications WHERE id=$1;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "Not found" };
    }

    return { status: 200, body: rows };
  } catch (err) {
    return { status: 500, body: err };
  }
}

/**
 * Retrieves all notifications for the plant 'id'.
 *
 * @param id - plant id
 * @returns {Promise<{body, status: number}|{body: string, status: number}|{body: *, status: number}>}
 */
async function dbGetNotificationByPlantId(id) {
  try {
    const query = {
      text: "SELECT * FROM notifications WHERE plant_id=$1 ORDER BY timestamp DESC;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "Not found" };
    }

    return { status: 200, body: rows };
  } catch (err) {
    return { status: 500, body: err };
  }
}

/**
 * Creates and returns a new notification requiring 'message', a 'timestamp', and a 'plant_id'.
 * Related tables are also altered accordingly.
 *
 * @param params
 * @returns {Promise<{body, status: number}|{body: *, status: number}>}
 */
async function dbCreateNotification(params) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryNotifications = {
      text: "INSERT INTO notifications(message, timestamp, plant_id) VALUES ($1, $2, $3) RETURNING *;",
      values: [params.message, params.timestamp, params.plant_id],
    };
    const resNotifications = await client.query(queryNotifications);

    const queryUsersId = "SELECT id FROM users;";
    const resUsers = await client.query(queryUsersId);

    const values = [];
    for (let row of resUsers.rows) {
      values.push([resNotifications.rows[0].id, row.id]);
    }

    const queryNotificationViews = format(
      "INSERT INTO notification_views(notification_id, user_id) VALUES %L",
      values
    );
    await client.query(queryNotificationViews);
    await client.query("COMMIT");
    return { status: 201, body: resNotifications.rows[0] };
  } catch (err) {
    await client.query("ROLLBACK");
    return { status: 501, body: err };
  } finally {
    client.release();
  }
}

/**
 * Updates a notification specified by its 'id' with the provided parameters.
 *
 * @param id - notification id
 * @param params - params to update: 'message', a 'timestamp', 'plant_id'
 * @returns {Promise<{body, status: number}|{body: string, status: number}|{body: *, status: number}>}
 */
async function dbUpdateNotification(id, params) {
  try {
    const query = {
      text: "UPDATE notifications SET message=$1, timestamp=$2, plant_id=$3 WHERE id=$4 RETURNING *;",
      values: [params.message, params.timestamp, params.plant_id, id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "Not found" };
    }

    return { status: 200, body: rows[0] };
  } catch (err) {
    return { status: 500, body: err };
  }
}

/**
 * Deletes the notification defined by 'id' and returns the id.
 *
 * @param id - notification id
 * @returns {Promise<{body, status: number}|{body: string, status: number}>}
 */
async function dbDeleteNotification(id) {
  try {
    const query = {
      text: "DELETE FROM notifications WHERE id=$1 RETURNING id;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "Not found" };
    }

    return { status: 200, body: rows[0].id };
  } catch (err) {
    return { status: 500, body: err };
  }
}

module.exports = {
  dbListNotifications,
  dbGetNotificationById,
  dbGetNotificationByPlantId,
  dbCreateNotification,
  dbUpdateNotification,
  dbDeleteNotification,
};
