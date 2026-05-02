const Booking = require("../Model/Booking");
const Event = require("../Model/Event");

const getAllBookings = async () => {
  return await Booking.find({})
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "-_id title category location date time bannerImage ticketPrice capacity status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const getBookingById = async (bookingId) => {
  return await Booking.findById(bookingId)
    .populate("attendee", "-_id firstName lastName email phone profileImage")
    .populate({
      path: "event",
      select:
        "-_id title description category location date time bannerImage ticketPrice capacity status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const getBookingsByEvent = async (eventId) => {
  return await Booking.find({ event: eventId })
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "-_id title category location date time bannerImage ticketPrice capacity status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const getBookingsByAttendee = async (attendeeId) => {
  return await Booking.find({ attendee: attendeeId })
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "-_id title category location date time bannerImage ticketPrice status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const getBookingsByPaymentStatus = async (paymentStatus) => {
  return await Booking.find({ paymentStatus: paymentStatus })
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "-_id title category location date time bannerImage ticketPrice capacity status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const getBookingsByTicketType = async (ticketType) => {
  return await Booking.find({ ticketType: ticketType })
    .populate("attendee", "-_id firstName lastName email")
    .populate({
      path: "event",
      select: "-_id title location date time bannerImage",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const createBooking = async (bookingData) => {
  const eventId = bookingData?.event;
  const attendeeId = bookingData?.attendee;

  if (!eventId || !attendeeId) {
    throw new Error("Event and attendee are required to create a booking");
  }

  const event = await Event.findById(eventId).select("organizer");

  if (!event) {
    const error = new Error("Event not found");
    error.statusCode = 404;
    throw error;
  }

  if (String(event.organizer) === String(attendeeId)) {
    const error = new Error("You cannot book tickets for your own event");
    error.statusCode = 403;
    throw error;
  }

  const booking = new Booking(bookingData);
  await booking.save();
  return await Booking.findById(booking._id)
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "-_id title category location date time bannerImage ticketPrice capacity status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const deleteBooking = async (bookingId) => {
  return await Booking.deleteOne({ _id: bookingId });
};

const updateBooking = async (bookingId, updateData) => {
  await Booking.updateOne({ _id: bookingId }, { $set: updateData });
  return await Booking.findById(bookingId)
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "-_id title category location date time bannerImage ticketPrice capacity status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const updatePaymentStatus = async (bookingId, paymentStatus) => {
  await Booking.updateOne(
    { _id: bookingId },
    { $set: { paymentStatus: paymentStatus } },
  );
  return await Booking.findById(bookingId)
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "-_id title category location date time bannerImage ticketPrice capacity status",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
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
