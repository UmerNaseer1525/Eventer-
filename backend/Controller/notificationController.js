const notificationService = require("../Services/notificationService");

const allowedTypes = [
  "booking",
  "event",
  "payment",
  "warning",
  "cancelled",
  "user",
  "info",
];

const allowedTargets = ["admin", "user", "all"];

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.getNotificationById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotificationsByTarget = async (req, res) => {
  try {
    const { target } = req.params;
    if (!allowedTargets.includes(target)) {
      return res
        .status(400)
        .json({ message: "Invalid target. Must be 'admin', 'user', or 'all'" });
    }
    const notifications = await notificationService.getNotificationsByTarget(target);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotificationsByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const notifications = await notificationService.getNotificationsByRecipient(
      recipientId,
    );
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUnreadNotificationsByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const notifications =
      await notificationService.getUnreadNotificationsByRecipient(recipientId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { type, title, message, target } = req.body;

    if (!type || !title || !message) {
      return res
        .status(400)
        .json({ message: "Type, title, and message are required" });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }

    if (target && !allowedTargets.includes(target)) {
      return res.status(400).json({ message: "Invalid notification target" });
    }

    const notification = await notificationService.createNotification(req.body);
    res.status(201).json({
      message: "Notification created successfully",
      notificationId: notification._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.deleteNotification(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotificationsByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const result = await notificationService.deleteNotificationsByRecipient(
      recipientId,
    );
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    const allowedFields = [
      "recipient",
      "target",
      "type",
      "category",
      "title",
      "message",
      "relatedId",
      "relatedModel",
      "read",
      "readAt",
    ];

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    }

    if (updateData.type && !allowedTypes.includes(updateData.type)) {
      return res.status(400).json({ message: "Invalid notification type" });
    }

    if (updateData.target && !allowedTargets.includes(updateData.target)) {
      return res.status(400).json({ message: "Invalid notification target" });
    }

    const result = await notificationService.updateNotification(id, updateData);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.markNotificationAsRead(id);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const result = await notificationService.markAllNotificationsAsRead(
      recipientId,
    );
    res.status(200).json({
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  getNotification,
  getNotificationsByTarget,
  getNotificationsByRecipient,
  getUnreadNotificationsByRecipient,
  createNotification,
  deleteNotification,
  deleteNotificationsByRecipient,
  updateNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};