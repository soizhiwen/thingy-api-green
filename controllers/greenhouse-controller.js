const router = require("koa-router")();
const { dbGetLastData, dbGetPastData } = require("../services/db-greenhouse");
const { verifyToken } = require("../services/auth-JWT");

router
  .get("/greenhouse/", verifyToken, getLastData)
  .get("/greenhouse/:appId/:start", verifyToken, getPastData);

async function getLastData(ctx) {
  const { status, body } = await dbGetLastData();
  ctx.body = body;
  ctx.status = status;
}

async function getPastData(ctx) {
  const appId = ctx.params.appId;
  const start = ctx.params.start;
  const { status, body } = await dbGetPastData(appId, start);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
