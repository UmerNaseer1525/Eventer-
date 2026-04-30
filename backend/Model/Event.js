const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  ticketPrice: {
    type: Number,
    required: true,
  },

  capacity: {
    type: Number,
    required: true,
  },

  bannerImage: {
    type: String,
    required: false,
  },

  status: {
    type: String,
    enum: ["completed","ongoing", "cancelled", 'upcoming'],
    default: "upcoming",
  },

  isApproved: {
    type:String,
    enum: ['pending', 'approved', 'rejected'],
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
