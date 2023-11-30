const router = require("koa-router")();

const {
  dbGetNotificationViewsById,
  dbCreateNotificationViews,
} = require("../services/db-notification-views");

const { verifyToken } = require("../services/auth-JWT");

router
  .get("/notification-views/:id", verifyToken, getNotificationViewsById)
  .post("/notification-views/", verifyToken, createNotificationViews);

async function getNotificationViewsById(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbGetNotificationViewsById(id);
  ctx.body = body;
  ctx.status = status;
}

async function createNotificationViews(ctx) {
  const params = ctx.request.body;
  const { status, body } = await dbCreateNotificationViews(params);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
