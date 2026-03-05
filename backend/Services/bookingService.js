const Booking = require("../Model/Booking");

const getAllBookings = async () => {
  return await Booking.find({})
    .populate("attendee", "firstName lastName email phone")
    .populate({
      path: "event",
      select: "title location date time bannerImage ticketPrice",
      populate: {
        path: "organizer",
        select: "firstName lastName email",
      },
    });
};

const getBookingById = async (bookingId) => {
  return await Booking.findById(bookingId)
    .populate("attendee", "firstName lastName email phone profileImage")
    .populate({
      path: "event",
      select:
        "title description location date time bannerImage ticketPrice capacity",
      populate: {
        path: "organizer",
        select: "firstName lastName email phone",
      },
    });
};

const getBookingsByEvent = async (eventId) => {
  return await Booking.find({ event: eventId })
    .populate("attendee", "firstName lastName email phone")
    .populate("event", "title location date time");
};

const getBookingsByAttendee = async (attendeeId) => {
  return await Booking.find({ attendee: attendeeId }).populate({
    path: "event",
    select: "title location date time bannerImage ticketPrice",
    populate: {
      path: "organizer",
      select: "firstName lastName email",
    },
  });
};

const getBookingsByPaymentStatus = async (paymentStatus) => {
  return await Booking.find({ paymentStatus: paymentStatus })
    .populate("attendee", "firstName lastName email phone")
    .populate({
      path: "event",
      select: "title location date time",
      populate: {
        path: "organizer",
        select: "firstName lastName email",
      },
    });
};

const getBookingsByTicketType = async (ticketType) => {
  return await Booking.find({ ticketType: ticketType })
    .populate("attendee", "firstName lastName email")
    .populate("event", "title location date time");
};

const createBooking = async (bookingData) => {
  const booking = new Booking(bookingData);
  return await booking.save();
};

const deleteBooking = async (bookingId) => {
  return await Booking.deleteOne({ _id: bookingId });
};

const updateBooking = async (bookingId, updateData) => {
  return await Booking.updateOne({ _id: bookingId }, { $set: updateData });
};

const updatePaymentStatus = async (bookingId, paymentStatus) => {
  return await Booking.updateOne(
    { _id: bookingId },
    { $set: { paymentStatus: paymentStatus } },
  );
};

const updateQuantity = async (bookingId, quantity) => {
  return await Booking.updateOne(
    { _id: bookingId },
    { $set: { quantity: quantity } },
  );
};

const updateTotalPrice = async (bookingId, totalPrice) => {
  return await Booking.updateOne(
    { _id: bookingId },
    { $set: { totalPrice: totalPrice } },
  );
};

const updateTicketType = async (bookingId, ticketType) => {
  return await Booking.updateOne(
    { _id: bookingId },
    { $set: { ticketType: ticketType } },
  );
};

module.exports = {
  getAllBookings,
  getBookingById,
  getBookingsByEvent,
  getBookingsByAttendee,
  getBookingsByPaymentStatus,
  getBookingsByTicketType,
  createBooking,
  deleteBooking,
  updateBooking,
  updatePaymentStatus,
  updateQuantity,
  updateTotalPrice,
  updateTicketType,
};
