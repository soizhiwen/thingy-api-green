/**
 * This file handles the http requests regarding which user has viewed a previously sent notification.
 */



const router = require("koa-router")();
const { verifyToken, getUserId } = require("../services/auth-JWT");
const {
  dbGetNotificationViewsByUserId,
  dbUpdateNotificationViews,
} = require("../services/db-notification-views");

router
  .get("/notification-views/", verifyToken, getNotificationViewsByUserId)
  .patch("/notification-views/", verifyToken, updateNotificationViews);

/**
 * This middleware requires a valid token in the 'authorization' header
 * and returns the viewed notifications of the user associated with this token.
 *
 * @param ctx - Koa context body
 */
async function getNotificationViewsByUserId(ctx) {
  const id = await getUserId(ctx);
  const { status, body } = await dbGetNotificationViewsByUserId(id);
  ctx.body = body;
  ctx.status = status;
}

/**
 * This middleware requires a valid token in the 'authorization' header
 * and returns the updated data.
 *
 * @param ctx - Koa context body
 */
async function updateNotificationViews(ctx) {
  const id = await getUserId(ctx);
  const { status, body } = await dbUpdateNotificationViews(id);
  ctx.body = body;
  ctx.status = status;
}

module.exports = router;
