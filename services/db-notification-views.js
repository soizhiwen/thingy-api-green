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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryUpdate = {
      text: "UPDATE notification_views SET viewed=$1 WHERE user_id=$2 AND viewed=$3 RETURNING *;",
      values: [true, id, false],
    };
    const resUpdate = await client.query(queryUpdate);

    const notificationIds = [];
    for (let row of resUpdate.rows) {
      notificationIds.push(row.notification_id);
    }

    const querySelect = {
      text: "SELECT n.*, nv.user_id, nv.viewed FROM notification_views AS nv JOIN notifications AS n ON nv.notification_id=n.id WHERE nv.notification_id=ANY($1::int[]) AND nv.user_id=$2;",
      values: [notificationIds, id],
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
