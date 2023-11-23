const router = require("koa-router")();

const {
  dbListPlants,
  dbCreatePlant,
  dbUpdatePlant,
  dbDeletePlant,
} = require("../services/db-plants");

router
  .get("/plants/", listPlants)
  .post("/plants/", createPlant)
  .patch("/plants/:id", updatePlant)
  .del("/plants/:id", deletePlant);

async function listPlants(ctx) {
  console.log("GET request to list all plants received!");
  const { status, body } = await dbListPlants();

  // Return all plants
  ctx.body = body;
  ctx.status = status;
}

async function createPlant(ctx) {
  console.log("POST request to add a plants received!");
  const params = ctx.request.body;

  // Call DB Function
  const { status, body } = await dbCreatePlant(params);
  ctx.body = body;
  ctx.status = status;
}

async function updatePlant(ctx) {
  console.log("PATCH request to change a plant's value received!");

  const id = ctx.params.id;
  const params = ctx.request.body;

  // Update in DB
  const { status, body } = await dbUpdatePlant(id, params);
  ctx.body = body;
  ctx.status = status;
}

async function deletePlant(ctx) {
  console.log("DELETE request received!");
  const id = ctx.params.id;

  // Remove plant from DB
  const { status, body } = await dbDeletePlant(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
