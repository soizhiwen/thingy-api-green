/**
 * This file contains the main http request middlewares for notifications.
 */



const { verifyToken } = require("../services/auth-JWT");
const {
  dbListNotifications,
  dbGetNotificationById,
  dbGetNotificationByPlantId,
  dbCreateNotification,
  dbUpdateNotification,
  dbDeleteNotification,
} = require("../services/db-notifications");
const { sendWebsocket } = require("../services/socketIo");
const router = require("koa-router")();


router
  .get("/notifications/", verifyToken, listNotifications)
  .get("/notifications/:id", verifyToken, getNotificationById)
  .get("/notifications/plants/:id", verifyToken, getNotificationByPlantId)
  .post("/notifications/", verifyToken, createNotification)
  .patch("/notifications/:id", verifyToken, updateNotification)
  .del("/notifications/:id", verifyToken, deleteNotification);
/**
 * This middleware adds all notifications to the response body. No parameter needed.
 *
 * @param ctx - Koa context object
 */
async function listNotifications(ctx) {
  const { status, body } = await dbListNotifications();
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware requires an id and returns the corresponding notification in the response body.
 *
 * @param ctx - Koa context object
 */
async function getNotificationById(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbGetNotificationById(id);
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware requires a plant id and returns all notifications for
 * that plant in the response body.
 *
 * @param ctx - Koa context object
 */
async function getNotificationByPlantId(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbGetNotificationByPlantId(id);
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware creates a new notification requiring a 'message', a 'timestamp', and a 'plant_id'.
 * The response body contains the new notification.
 *
 * @param ctx - Koa context object
 */
async function createNotification(ctx) {
  const params = ctx.request.body;
  const { status, body } = await dbCreateNotification(params);
  await sendWebsocket('newNotification');
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware updates an existing notification defined by the 'id' with a 'message', a 'timestamp',
 * and a 'plant_id'. The response body contains the updated notification.
 *
 * @param ctx - Koa context object
 */
async function updateNotification(ctx) {
  const id = ctx.params.id;
  const params = ctx.request.body;
  const { status, body } = await dbUpdateNotification(id, params);

  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware deletes the notification defined by 'id' and returns the 'id' in the response body.
 *
 * @param ctx - Koa context object
 */
async function deleteNotification(ctx) {
  const id = ctx.params.id;
  const { status, body } = await dbDeleteNotification(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
