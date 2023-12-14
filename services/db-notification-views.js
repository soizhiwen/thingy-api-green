/**
 * This files interfaces with the database regarding viewed notifications.
 */



const { pool } = require("../models/pg");

/**
 * Takes a user id and returns the viewed notifications for that user from the database.
 *
 * @param id - user id
 * @returns {Promise<{body, status: number}|{body: string, status: number}|{body: *, status: number}>}
 */
async function dbGetNotificationViewsByUserId(id) {
  try {
    const query = {
      text: "SELECT n.*, nv.user_id, nv.viewed FROM notification_views AS nv JOIN notifications AS n ON nv.notification_id=n.id JOIN users AS u ON nv.user_id=u.id WHERE nv.user_id=$1;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "Not found" };
    }

    for (let row of rows) {
      row.viewed = row.viewed ? "Read" : "New";
    }

    return { status: 200, body: rows };
  } catch (err) {
    return { status: 500, body: err };
  }
}

/**
 * Takes a user id and returns the updated viewed notifications for that user from the database.
 *
 * @param id - user id
 * @returns {Promise<{body, status: number}|{body: string, status: number}|{body: *, status: number}>}
 */
async function dbUpdateNotificationViews(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryUpdate = {
      text: "UPDATE notification_views SET viewed=$1 WHERE user_id=$2 AND viewed=$3;",
      values: [true, id, false],
    };
    await client.query(queryUpdate);

    const querySelect = {
      text: "SELECT n.*, nv.user_id, nv.viewed FROM notification_views AS nv JOIN notifications AS n ON nv.notification_id=n.id JOIN users AS u ON nv.user_id=u.id WHERE nv.user_id=$1;",
      values: [id],
    };
    const { rows } = await client.query(querySelect);
    await client.query("COMMIT");

    for (let row of rows) {
      row.viewed = row.viewed ? "Read" : "New";
    }

    return { status: 200, body: rows };
  } catch (err) {
    await client.query("ROLLBACK");
    return { status: 500, body: err };
  } finally {
    client.release();
  }
}

module.exports = {
  dbGetNotificationViewsByUserId,
  dbUpdateNotificationViews,
};
