const Notification = require("../Model/Notification");

const getAllNotifications = async () => {
  return await Notification.find({}).populate(
    "recipient",
    "firstName lastName email role",
  );
};

const getNotificationById = async (notificationId) => {
  return await Notification.findById(notificationId).populate(
    "recipient",
    "firstName lastName email role",
  );
};

const getNotificationsByTarget = async (target) => {
  return await Notification.find({ target: target }).populate(
    "recipient",
    "firstName lastName email role",
  );
};

const getNotificationsByRecipient = async (recipientId) => {
  return await Notification.find({ recipient: recipientId }).populate(
    "recipient",
    "firstName lastName email role",
  );
};

const getUnreadNotificationsByRecipient = async (recipientId) => {
  return await Notification.find({ recipient: recipientId, read: false }).populate(
    "recipient",
    "firstName lastName email role",
  );
};

const createNotification = async (notificationData) => {
  const notification = new Notification(notificationData);
  return await notification.save();
};

const deleteNotification = async (notificationId) => {
  return await Notification.deleteOne({ _id: notificationId });
};

const deleteNotificationsByRecipient = async (recipientId) => {
  return await Notification.deleteMany({ recipient: recipientId });
};

const updateNotification = async (notificationId, updateData) => {
  return await Notification.updateOne(
    { _id: notificationId },
    { $set: updateData },
  );
};

const markNotificationAsRead = async (notificationId) => {
  return await Notification.updateOne(
    { _id: notificationId },
    { $set: { read: true, readAt: new Date() } },
  );
};

const markAllNotificationsAsRead = async (recipientId) => {
  return await Notification.updateMany(
    { recipient: recipientId, read: false },
    { $set: { read: true, readAt: new Date() } },
  );
};

module.exports = {
  getAllNotifications,
  getNotificationById,
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