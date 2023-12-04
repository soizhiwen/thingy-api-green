const router = require("koa-router")();

const {
  dbGetNotificationSentById,
  dbCreateNotificationSent,
} = require("../services/db-notification-sent");

const { verifyToken } = require("../services/auth-JWT");

router
  .get("/notification-sent/:id", verifyToken, getNotificationSentById)
  .post("/notification-sent/", verifyToken, createNotificationSent);

async function getNotificationSentById(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbGetNotificationSentById(id);
  ctx.body = body;
  ctx.status = status;
}

async function createNotificationSent(ctx) {
  const params = ctx.request.body;
  const { status, body } = await dbCreateNotificationSent(params);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
