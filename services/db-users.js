const { pool } = require("../models/pg");

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<{body, status: number}|{body: *, status: number}>}
 */
async function dbListUsers() {
  console.log("Received List Users request.");
  try {
    const query = "SELECT * FROM users ORDER BY id ASC;";
    const { rows } = await pool.query(query);
    return { status: 200, body: rows };
  } catch (err) {
    return { status: 500, body: err };
  }
}

/**
 * Retrieves a user defined by 'id' from the database.
 *
 * @param id - user id
 * @returns {Promise<{body, status: number}|{body: string, status: number}|{body: *, status: number}>}
 */
async function dbGetUserById(id) {
  console.log(`Received request for user by ID: ${id}`);
  try {
    const query = {
      text: "SELECT * FROM users WHERE id=$1;",
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
 * Retrieves a user with 'email' from the database.
 *
 * @param email - email address of a user
 * @returns {Promise<{body, status: number}|{body: *, status: number}|{body: {error: string}, status: number}>}
 */
async function dbGetUserByEmail(email) {
  console.log(`Received request for user by email: ${email}`);
  try {
    const query = {
      text: "SELECT * FROM users WHERE email=$1;",
      values: [email],
    };
    const { rows } = await pool.query(query);

    if (rows.length === 0) {
      return { status: 404, body: "User not found" };
    }

    return { status: 200, body: rows[0] };
  } catch (err) {
    return { status: 500, body: err };
  }
}

/**
 * Creates a user with 'name', 'email', 'password', and 'role'.
 * The 'role' defines the type of user, i.e., 'Admin' or 'User'.
 * Returns the created user.
 *
 * @param params - user parameters: 'name', 'email', 'password', 'role'
 * @returns {Promise<{body, status: number}|{body: *, status: number}>}
 */
async function dbCreateUser(params) {
  console.log(`Received Add User Request: ${JSON.stringify(params)}`);
  try {
    const query = {
      text: "INSERT INTO users(name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;",
      values: [params.name, params.email, params.password, params.role],
    };
    const { rows } = await pool.query(query);
    return { status: 201, body: rows[0] };
  } catch (err) {
    return { status: 409, body: err };
  }
}

/**
 * Updates a user with 'name', 'email', 'password', and 'role'.
 * The 'role' defines the type of user, i.e., 'Admin' or 'User'.
 * Returns the created user.
 *
 * @param id - id of user to update
 * @param params - user parameters: 'name', 'email', 'password', 'role'
 * @returns {Promise<{body, status: number}|{body: string, status: number}|{body: *, status: number}>}
 */
async function dbUpdateUser(id, params) {
  console.log(`Received Update User request: ${JSON.stringify(params)}`);
  try {
    const query = {
      text: "UPDATE users SET name=$1, email=$2, password=$3, role=$4 WHERE id=$5 RETURNING *;",
      values: [params.name, params.email, params.password, params.role, id],
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
 * Deletes the user defined by 'id' and returns the id.
 *
 * @param id - id of user to delete
 * @returns {Promise<{body, status: number}|{body: string, status: number}>}
 */
async function dbDeleteUser(id) {
  console.log(`Received Delete User request: ${id}`);
  try {
    const query = {
      text: "DELETE FROM users WHERE id=$1 RETURNING id;",
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
  dbListUsers,
  dbGetUserById,
  dbGetUserByEmail,
  dbCreateUser,
  dbUpdateUser,
  dbDeleteUser,
};
