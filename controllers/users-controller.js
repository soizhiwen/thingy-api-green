const router = require("koa-router")();

const {
  dbListUsers,
  dbGetUserById,
  dbCreateUser,
  dbUpdateUser,
  dbDeleteUser,
} = require("../services/db-users");

router
  .get("/users/", listUsers)
  .get("/users/:id", getUserById)
  .post("/users/", createUser)
  .patch("/users/:id", updateUser)
  .del("/users/:id", deleteUser);

async function listUsers(ctx) {
  console.log("GET request to list all users received!");
  const { status, body } = await dbListUsers();

  // Return all users
  ctx.body = body;
  ctx.status = status;
}

async function getUserById(ctx) {
  console.log("GET request for one User by ID received!");
  const id = ctx.params.id;
  const { status, body } = await dbGetUserById(id);

  // Return user
  ctx.body = body;
  ctx.status = status;
}

async function createUser(ctx) {
  console.log("POST request to add a user received!");
  const params = ctx.request.body;

  // Call DB Function
  const { status, body } = await dbCreateUser(params);
  ctx.body = body;
  ctx.status = status;
}

async function updateUser(ctx) {
  console.log("PATCH request to change a user's value received!");

  const id = ctx.params.id;
  const params = ctx.request.body;

  // Update in DB
  const { status, body } = await dbUpdateUser(id, params);
  ctx.body = body;
  ctx.status = status;
}

async function deleteUser(ctx) {
  console.log("DELETE request received!");
  const id = ctx.params.id;

  // Remove user from DB
  const { status, body } = await dbDeleteUser(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
