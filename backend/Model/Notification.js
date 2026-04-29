const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  target: {
    type: String,
    enum: ["admin", "user", "all"],
    default: "user",
  },

  type: {
    type: String,
    enum: ["booking", "event", "payment", "warning", "cancelled", "user", "info"],
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },

  relatedModel: {
    type: String,
    required: false,
  },

  read: {
    type: Boolean,
    default: false,
  },

  readAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);