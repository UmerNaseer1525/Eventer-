const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },

  transactionId: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  method: {
    type: String,
    enum: ["card", "jazzcash", "easypaisa"],
    required: true,
  },

  status: {
    type: String,
    enum: ["success", "failed"],
    required: true,
  },

  paidAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
