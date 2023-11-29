const router = require("koa-router")();

const {
  dbListNotifications,
  dbGetNotificationById,
  dbGetNotificationByPlantId,
  dbGetNotificationByUserId,
  dbCreateNotification,
  dbUpdateNotification,
  dbDeleteNotification,
} = require("../services/db-notifications");

const { verifyToken } = require("../services/auth-JWT");

router
  .get("/notifications/", verifyToken, listNotifications)
  .get("/notifications/:id", verifyToken, getNotificationById)
  .get("/notifications/plants/:id", verifyToken, getNotificationByPlantId)
  .get("/notifications/users/:id", verifyToken, getNotificationByUserId)
  .post("/notifications/", verifyToken, createNotification)
  .patch("/notifications/:id", verifyToken, updateNotification)
  .del("/notifications/:id", verifyToken, deleteNotification);

async function listNotifications(ctx) {
  const { status, body } = await dbListNotifications();
  ctx.body = body;
  ctx.status = status;
}

async function getNotificationById(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbGetNotificationById(id);
  ctx.body = body;
  ctx.status = status;
}

async function getNotificationByPlantId(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbGetNotificationByPlantId(id);
  ctx.body = body;
  ctx.status = status;
}

async function getNotificationByUserId(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbGetNotificationByUserId(id);
  ctx.body = body;
  ctx.status = status;
}

async function createNotification(ctx) {
  const params = ctx.request.body;
  const { status, body } = await dbCreateNotification(params);
  ctx.body = body;
  ctx.status = status;
}

async function updateNotification(ctx) {
  const id = ctx.params.id;
  const params = ctx.request.body;
  const { status, body } = await dbUpdateNotification(id, params);
  ctx.body = body;
  ctx.status = status;
}

async function deleteNotification(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbDeleteNotification(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
