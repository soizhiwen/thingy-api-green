const router = require("koa-router")();
const { dbGetLastData, dbGetPastData } = require("../services/db-greenhouse");
const { verifyToken } = require("../services/auth-JWT");

router
  .get("/greenhouse/", verifyToken, getLastData)
  .get("/greenhouse/:appId/:start", verifyToken, getPastData);

/**
 * This middleware retrieves the last data point from the measurement Database (InfluxDB).
 * This data point is returned in the response body.
 *
 * @param ctx - Koa context object
 */
async function getLastData(ctx) {
  const { status, body } = await dbGetLastData();
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware retrieves data within the current time and the time span going back defined in 'start'.
 * The data is returned in the response body.
 *
 * @param ctx - Koa context object
 */
async function getPastData(ctx) {
  const appId = ctx.params.appId;
  const start = ctx.params.start;
  const { status, body } = await dbGetPastData(appId, start);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
