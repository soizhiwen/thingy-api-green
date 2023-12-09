const { pool } = require("../models/pg");

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

async function dbUpdateNotificationViews(id) {
  try {
    const query = {
      text: "UPDATE notification_views SET viewed=$1 WHERE user_id=$2 AND viewed=$3 RETURNING *;",
      values: [true, id, false],
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

module.exports = {
  dbGetNotificationViewsByUserId,
  dbUpdateNotificationViews,
};
