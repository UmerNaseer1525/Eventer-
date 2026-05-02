const Booking = require("../Model/Booking");
const Event = require("../Model/Event");

const getAllBookings = async () => {
  return await Booking.find({})
    .populate("attendee", "-_id firstName lastName email phone")
    .populate({
      path: "event",
      select: "_id title category location date time bannerImage ticketPrice capacity status",
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
        "title description category location date time bannerImage ticketPrice capacity status",
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
      select: "title category location date time bannerImage ticketPrice capacity status",
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
      select: "title category location date time bannerImage ticketPrice status",
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
      select: "title category location date time bannerImage ticketPrice capacity status",
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
      select: "title location date time bannerImage",
      populate: {
        path: "organizer",
        select: "-_id firstName lastName email phone",
      },
    });
};

const createBooking = async (bookingData) => {
  const eventId = bookingData?.event;
  const attendeeId = bookingData?.attendee;
  const seatsReserved = Number(
    bookingData?.seatsReserved ?? bookingData?.quantity ?? 1,
  );

  if (!eventId || !attendeeId) {
    throw new Error("Event and attendee are required to create a booking");
  }

  if (!Number.isFinite(seatsReserved) || seatsReserved < 1) {
    const error = new Error("seatsReserved must be at least 1");
    error.statusCode = 400;
    throw error;
  }

  const event = await Event.findById(eventId).select("organizer capacity");

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

  const availableSeats = Math.max(0, Number(event.capacity ?? 0));
  if (seatsReserved > availableSeats) {
    const error = new Error("Not enough seats available");
    error.statusCode = 400;
    throw error;
  }

  await Event.updateOne(
    { _id: eventId },
    { $set: { capacity: availableSeats - seatsReserved } },
  );

  const bookingPayload = {
    ...bookingData,
    quantity: Number(bookingData?.quantity ?? seatsReserved),
    seatsReserved,
  };

  let booking;
  try {
    booking = new Booking(bookingPayload);
    await booking.save();
  } catch (error) {
    // rollback reserved seats if booking save fails
    await Event.updateOne(
      { _id: eventId },
      { $set: { capacity: availableSeats } },
    );
    throw error;
  }

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
  const booking = await Booking.findById(bookingId).select("event seatsReserved quantity");
  if (!booking) {
    return { deletedCount: 0 };
  }

  const releasedSeats = Math.max(
    1,
    Number(booking.seatsReserved ?? booking.quantity ?? 1),
  );

  const deletionResult = await Booking.deleteOne({ _id: bookingId });
  if (deletionResult.deletedCount > 0) {
    await Event.updateOne(
      { _id: booking.event },
      { $inc: { capacity: releasedSeats } },
    );
  }

  return deletionResult;
};

const updateBooking = async (bookingId, updateData) => {
  const booking = await Booking.findById(bookingId).select("event quantity seatsReserved");
  if (!booking) {
    return null;
  }

  const updatePayload = { ...updateData };
  const requestedSeatsRaw =
    updateData?.seatsReserved !== undefined
      ? updateData.seatsReserved
      : updateData?.quantity;

  if (requestedSeatsRaw !== undefined) {
    const previousSeats = Math.max(
      1,
      Number(booking.seatsReserved ?? booking.quantity ?? 1),
    );
    const requestedSeats = Math.max(1, Number(requestedSeatsRaw));
    const delta = requestedSeats - previousSeats;

    if (delta > 0) {
      const event = await Event.findById(booking.event).select("capacity");
      const availableSeats = Math.max(0, Number(event?.capacity ?? 0));
      if (delta > availableSeats) {
        const error = new Error("Not enough seats available");
        error.statusCode = 400;
        throw error;
      }
      await Event.updateOne({ _id: booking.event }, { $inc: { capacity: -delta } });
    } else if (delta < 0) {
      await Event.updateOne({ _id: booking.event }, { $inc: { capacity: Math.abs(delta) } });
    }

    updatePayload.quantity = requestedSeats;
    updatePayload.seatsReserved = requestedSeats;
  }

  await Booking.updateOne({ _id: bookingId }, { $set: updatePayload });
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
  const result = await Booking.updateOne(
    { _id: bookingId },
    { $set: { paymentStatus: paymentStatus } },
  );
  if (result.matchedCount === 0) {
    return null;
  }

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
  const booking = await Booking.findById(bookingId).select("event quantity seatsReserved");
  if (!booking) {
    return { matchedCount: 0 };
  }

  const previousSeats = Math.max(
    1,
    Number(booking.seatsReserved ?? booking.quantity ?? 1),
  );
  const requestedSeats = Math.max(1, Number(quantity));
  const delta = requestedSeats - previousSeats;

  if (delta > 0) {
    const event = await Event.findById(booking.event).select("capacity");
    const availableSeats = Math.max(0, Number(event?.capacity ?? 0));
    if (delta > availableSeats) {
      const error = new Error("Not enough seats available");
      error.statusCode = 400;
      throw error;
    }
    await Event.updateOne({ _id: booking.event }, { $inc: { capacity: -delta } });
  } else if (delta < 0) {
    await Event.updateOne({ _id: booking.event }, { $inc: { capacity: Math.abs(delta) } });
  }

  await Booking.updateOne(
    { _id: bookingId },
    { $set: { quantity: requestedSeats, seatsReserved: requestedSeats } },
  );

  return { matchedCount: 1 };
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
