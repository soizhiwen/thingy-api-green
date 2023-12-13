/**
 * This file contains the middlewares concerning plant requests.
 */



const router = require("koa-router")();
const { verifyToken, verifyAdminToken } = require("../services/auth-JWT");
const {
  dbListPlants,
  dbCreatePlant,
  dbUpdatePlant,
  dbDeletePlant,
} = require("../services/db-plants");

router
  .get("/plants/", verifyToken, listPlants)
  .post("/plants/", verifyAdminToken, createPlant)
  .patch("/plants/:id", verifyAdminToken, updatePlant)
  .del("/plants/:id", verifyAdminToken, deletePlant);

/**
 * This middleware adds all plants to the response body. No parameter needed.
 *
 * @param ctx - Koa context object
 */
async function listPlants(ctx) {
  console.log("GET request to list all plants received!");
  const { status, body } = await dbListPlants();

  // Return all plants
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware creates a new plant and returns it in the response body.
 * The necessary parameters are: 'name', 'harvest_date', 'min_temperature', 'max_temperature',
 * 'min_humidity', 'max_humidity', min_co2', 'max_co2', 'min_air_quality' and 'max_air_quality'.
 *
 * @param ctx - Koa context object
 */
async function createPlant(ctx) {
  console.log("POST request to add a plant received!");
  const params = ctx.request.body;

  // Call DB Function
  const { status, body } = await dbCreatePlant(params);
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware updates a plant specified by 'id' with the parameters:
 * 'name', 'harvest_date', 'min_temperature', 'max_temperature', 'min_humidity',
 * 'max_humidity', min_co2', 'max_co2', 'min_air_quality' and 'max_air_quality'.
 * The updated plant is returned in the response body.
 *
 * @param ctx - Koa context object
 */
async function updatePlant(ctx) {
  console.log("PATCH request to change a plant's value received!");

  const id = ctx.params.id;
  const params = ctx.request.body;

  // Update in DB
  const { status, body } = await dbUpdatePlant(id, params);
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware deletes a plant specified by 'id' and returns the deleted plant's 'id'
 * in the response body.
 *
 * @param ctx - Koa context object
 */
async function deletePlant(ctx) {
  console.log("DELETE request received!");
  const id = ctx.params.id;

  // Remove plant from DB
  const { status, body } = await dbDeletePlant(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
