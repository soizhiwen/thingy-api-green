const { pool } = require("../models/pg");

async function dbListNotifications() {
  try {
    const query = "SELECT * FROM notifications ORDER BY id DESC;";
    const { rows } = await pool.query(query);
    return { status: 200, body: rows };
  } catch (err) {
    return { status: 500, body: err };
  }
}

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

async function dbGetNotificationByUserId(id) {
  try {
    const query = {
      text: "SELECT * FROM notifications WHERE user_id=$1 ORDER BY timestamp DESC;",
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

async function dbCreateNotification(params) {
  try {
    const query = {
      text: "INSERT INTO notifications(message, timestamp, plant_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *;",
      values: [params.message, params.timestamp, params.plant_id, params.user_id],
    };
    const { rows } = await pool.query(query);
    return { status: 201, body: rows[0] };
  } catch (err) {
    return { status: 501, body: err };
  }
}

async function dbUpdateNotification(id, params) {
  try {
    const query = {
      text: "UPDATE notifications SET message=$1, timestamp=$2, plant_id=$3, user_id=$4 WHERE id=$5 RETURNING *;",
      values: [params.message, params.timestamp, params.plant_id, params.user_id, id],
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
  dbGetNotificationByUserId,
  dbCreateNotification,
  dbUpdateNotification,
  dbDeleteNotification,
};
