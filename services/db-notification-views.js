const { pool } = require("../models/pg");

async function dbGetNotificationViewsById(id) {
  try {
    const query = {
      text: "SELECT nv.*, u.name, u.email, u.role FROM notification_views AS nv JOIN notifications AS n ON nv.notification_id=n.id JOIN users AS u ON nv.user_id=u.id WHERE nv.notification_id=$1;",
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

async function dbCreateNotificationViews(params) {
  try {
    const query = {
      text: "INSERT INTO notification_views(notification_id, user_id) VALUES ($1, $2) RETURNING *;",
      values: [params.notification_id, params.user_id],
    };
    const { rows } = await pool.query(query);
    return { status: 201, body: rows[0] };
  } catch (err) {
    return { status: 501, body: err };
  }
}

module.exports = {
  dbGetNotificationViewsById,
  dbCreateNotificationViews,
};
