const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  attendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ticketType: {
    type: String,
    enum: ["VIP", "Regular"],
    required: true,
  },

  quantity: {
    type: Number,
    default: 1,
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
