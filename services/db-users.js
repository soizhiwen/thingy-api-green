const { pool } = require("../models/pg");

async function dbListAdmins() {
  console.log("Received List Admins request.");

  try {
    const query = {
      text: "SELECT * FROM users WHERE role=$1 ORDER BY id ASC;",
      values: ["Admin"],
    };
    const { rows } = await pool.query(query);
    return { status: 200, admins: rows };
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbListUsers() {
  console.log("Received List Users request.");

  try {
    const query = {
      text: "SELECT * FROM users WHERE role=$1 ORDER BY id ASC;",
      values: ["User"],
    };
    const { rows } = await pool.query(query);
    return { status: 200, users: rows };
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbGetAdminById(id) {
  console.log(`Received request for admin by ID: ${id}`);

  try {
    const query = {
      text: "SELECT * FROM users WHERE role=$1 AND id=$2;",
      values: ["Admin", id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return { status: 200, admin: rows };
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbGetUserById(id) {
  console.log(`Received request for user by ID: ${id}`);

  try {
    const query = {
      text: "SELECT * FROM users WHERE role=$1 AND id=$2;",
      values: ["User", id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return { status: 200, user: rows };
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbRegisterAdmin(params) {
  console.log(`Received Add Admin Request: ${JSON.stringify(params)}`);

  try {
    const query = {
      text: "INSERT INTO users(name, email, role) VALUES ($1, $2, $3) RETURNING id;",
      values: [params.name, params.email, params.role],
    };
    const { rows } = await pool.query(query);
    return { status: 201, adminId: rows[0].id };
  } catch (err) {
    console.log(err);
    return 501;
  }
}

async function dbAddUser(params) {
  console.log(`Received Add User Request: ${JSON.stringify(params)}`);

  try {
    const query = {
      text: "INSERT INTO users(name, email, role) VALUES ($1, $2, $3) RETURNING id;",
      values: [params.name, params.email, params.role],
    };
    const { rows } = await pool.query(query);
    return { status: 201, userId: rows[0].id };
  } catch (err) {
    console.log(err);
    return 501;
  }
}

async function dbUpdateAdmin(id, params) {
  console.log(`Received Update Admin request: ${JSON.stringify(params)}`);
  try {
    const query = {
      text: "UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING *;",
      values: [params.name, params.email, params.role, id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbUpdateUser(id, params) {
  console.log(`Received Update User request: ${JSON.stringify(params)}`);
  try {
    const query = {
      text: "UPDATE users SET name=$1, email=$2, role=$3 WHERE id=$4 RETURNING *;",
      values: [params.name, params.email, params.role, id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbRemoveAdmin(id) {
  console.log(`Received Delete Admin request: ${id}`);

  try {
    const query = {
      text: "DELETE FROM users WHERE id=$1 RETURNING *;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
}

async function dbRemoveUser(id) {
  console.log(`Received Delete User request: ${id}`);

  try {
    const query = {
      text: "DELETE FROM users WHERE id=$1 RETURNING *;",
      values: [id],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return 404;
    }

    return 200;
  } catch (err) {
    console.log(err);
    return 500;
  }
}

module.exports = {
  dbListAdmins,
  dbListUsers,
  dbGetAdminById,
  dbGetUserById,
  dbRegisterAdmin,
  dbAddUser,
  dbUpdateAdmin,
  dbUpdateUser,
  dbRemoveAdmin,
  dbRemoveUser,
};
