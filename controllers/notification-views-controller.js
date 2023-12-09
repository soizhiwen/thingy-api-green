const router = require("koa-router")();

const {
  dbGetNotificationViewsByUserId,
  dbUpdateNotificationViews,
} = require("../services/db-notification-views");

const { verifyToken, getUserId } = require("../services/auth-JWT");

router
  .get("/notification-views/", verifyToken, getNotificationViewsByUserId)
  .patch("/notification-views/", verifyToken, updateNotificationViews);

async function getNotificationViewsByUserId(ctx) {
  const id = await getUserId(ctx);
  const { status, body } = await dbGetNotificationViewsByUserId(id);
  ctx.body = body;
  ctx.status = status;
}

async function updateNotificationViews(ctx) {
  const id = await getUserId(ctx);
  const { status, body } = await dbUpdateNotificationViews(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
