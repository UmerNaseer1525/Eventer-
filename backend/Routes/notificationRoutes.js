const express = require("express");
const router = express.Router();
const notificationController = require("../Controller/notificationController");
const { authenticateToken } = require("../Middleware/authMiddleware");

router.use(authenticateToken);

router.get("/target/:target", notificationController.getNotificationsByTarget);
router.get(
  "/recipient/:recipientId/unread",
  notificationController.getUnreadNotificationsByRecipient,
);
router.get(
  "/recipient/:recipientId",
  notificationController.getNotificationsByRecipient,
);
router.get("/", notificationController.getNotifications);
router.get("/:id", notificationController.getNotification);

router.post("/", notificationController.createNotification);

router.put("/recipient/:recipientId/read-all", notificationController.markAllNotificationsAsRead);
router.put("/:id/read", notificationController.markNotificationAsRead);
router.put("/:id", notificationController.updateNotification);

router.delete("/recipient/:recipientId", notificationController.deleteNotificationsByRecipient);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;