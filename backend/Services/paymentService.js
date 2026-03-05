const Payment = require("../Model/Payment");

const getAllPayments = async () => {
  return await Payment.find({}).populate({
    path: "booking",
    populate: [
      {
        path: "attendee",
        select: "firstName lastName email phone",
      },
      {
        path: "event",
        select: "title location date time",
      },
    ],
  });
};

const getPaymentById = async (paymentId) => {
  return await Payment.findById(paymentId).populate({
    path: "booking",
    populate: [
      {
        path: "attendee",
        select: "firstName lastName email phone profileImage",
      },
      {
        path: "event",
        select: "title description location date time ticketPrice",
        populate: {
          path: "organizer",
          select: "firstName lastName email",
        },
      },
    ],
  });
};

const getPaymentsByBooking = async (bookingId) => {
  return await Payment.find({ booking: bookingId });
};

const getPaymentsByMethod = async (method) => {
  return await Payment.find({ method: method }).populate({
    path: "booking",
    populate: [
      {
        path: "attendee",
        select: "firstName lastName email",
      },
      {
        path: "event",
        select: "title location date",
      },
    ],
  });
};

const getPaymentsByStatus = async (status) => {
  return await Payment.find({ status: status }).populate({
    path: "booking",
    populate: [
      {
        path: "attendee",
        select: "firstName lastName email",
      },
      {
        path: "event",
        select: "title location date",
      },
    ],
  });
};

const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  return await payment.save();
};

const deletePayment = async (paymentId) => {
  return await Payment.deleteOne({ _id: paymentId });
};

const updatePayment = async (paymentId, updateData) => {
  return await Payment.updateOne({ _id: paymentId }, { $set: updateData });
};

const updateStatus = async (paymentId, status) => {
  return await Payment.updateOne(
    { _id: paymentId },
    { $set: { status: status } },
  );
};

const updateAmount = async (paymentId, amount) => {
  return await Payment.updateOne(
    { _id: paymentId },
    { $set: { amount: amount } },
  );
};

const updatePaidAt = async (paymentId, paidAt) => {
  return await Payment.updateOne(
    { _id: paymentId },
    { $set: { paidAt: paidAt } },
  );
};

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentsByBooking,
  getPaymentsByMethod,
  getPaymentsByStatus,
  createPayment,
  deletePayment,
  updatePayment,
  updateStatus,
  updateAmount,
  updatePaidAt,
};
