/**
 * This file contains wrapper functions to interface with HTTP requests regarding users.
 * Login and register are specified in 'auth-controller.js'.
 */

const router = require("koa-router")();
const { verifyToken, verifyAdminToken } = require("../services/auth-JWT");
const {
  dbListUsers,
  dbGetUserById,
  dbCreateUser,
  dbUpdateUser,
  dbDeleteUser,
} = require("../services/db-users");

router
  .get("/users/", verifyToken, listUsers)
  .get("/users/:id", verifyToken, getUserById)
  .post("/users/", verifyAdminToken, createUser)
  .patch("/users/:id",verifyAdminToken, updateUser)
  .del("/users/:id", verifyAdminToken, deleteUser);

/**
 * This middleware does not require any arguments. It adds a list of all users to the response body.
 *
 * @param ctx - Koa context object
 */
async function listUsers(ctx) {
  console.log("GET request to list all users received!");
  const { status, body } = await dbListUsers();

  // Return all users
  ctx.body = body;
  ctx.status = status;
}


/**
 * This middleware required a user id and returns the user in the response body.
 *
 * @param ctx - Koa context object
 */
async function getUserById(ctx) {
  console.log("GET request for one User by ID received!");
  const id = ctx.params.id;
  const { status, body } = await dbGetUserById(id);

  // Return user
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware necessitates multiple arguments for user creation in the database:
 * 'name', 'email', 'password', and 'role'. The 'role' defines the type of user,
 * i.e., 'Admin' or 'User'. The response contains the newly created user.
 *
 * @param ctx - Koa context body
 */
async function createUser(ctx) {
  console.log("POST request to add a user received!");
  const params = ctx.request.body;

  // Call DB Function
  const { status, body } = await dbCreateUser(params);
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware updates the user in the database with the provided arguments:
 * 'name', 'email', 'password', and 'role'. The 'role' defines the type of user,
 * i.e., 'Admin' or 'User'. The response contains the newly created user.
 *
 * @param ctx - Koa context body
 */
async function updateUser(ctx) {
  console.log("PATCH request to change a user's value received!");

  const id = ctx.params.id;
  const params = ctx.request.body;

  // Update in DB
  const { status, body } = await dbUpdateUser(id, params);
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware removes a user specified by 'id' from the database.
 * The response contains this user's id.
 *
 * @param ctx - Koa context body
 */
async function deleteUser(ctx) {
  console.log("DELETE request received!");
  const id = ctx.params.id;

  // Remove user from DB
  const { status, body } = await dbDeleteUser(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
