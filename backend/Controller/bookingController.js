const bookingService = require("../Services/bookingService");

const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await bookingService.getBookingsByEvent(eventId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByAttendee = async (req, res) => {
  try {
    const { attendeeId } = req.params;
    const bookings = await bookingService.getBookingsByAttendee(attendeeId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.params;
    if (!["paid", "pending", "failed"].includes(paymentStatus)) {
      return res.status(400).json({
        message:
          "Invalid payment status. Must be 'paid', 'pending', or 'failed'",
      });
    }
    const bookings =
      await bookingService.getBookingsByPaymentStatus(paymentStatus);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByTicketType = async (req, res) => {
  try {
    const { ticketType } = req.params;
    if (!["VIP", "Regular"].includes(ticketType)) {
      return res.status(400).json({
        message: "Invalid ticket type. Must be 'VIP' or 'Regular'",
      });
    }
    const bookings = await bookingService.getBookingsByTicketType(ticketType);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({
      message: "Booking created successfully",
      bookingId: booking._id,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingService.deleteBooking(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingService.updateBooking(id, req.body);
    if (!result) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking updated successfully", booking: result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status is required" });
    }
    if (!["paid", "pending", "failed"].includes(paymentStatus)) {
      return res.status(400).json({
        message:
          "Invalid payment status. Must be 'paid', 'pending', or 'failed'",
      });
    }
    const result = await bookingService.updatePaymentStatus(id, paymentStatus);
    if (!result) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Payment status updated successfully", booking: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ message: "Quantity is required" });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const result = await bookingService.updateQuantity(id, quantity);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const updateTotalPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalPrice } = req.body;
    if (totalPrice === undefined || totalPrice === null) {
      return res.status(400).json({ message: "Total price is required" });
    }
    if (totalPrice < 0) {
      return res
        .status(400)
        .json({ message: "Total price cannot be negative" });
    }
    const result = await bookingService.updateTotalPrice(id, totalPrice);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Total price updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicketType = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticketType } = req.body;
    if (!ticketType) {
      return res.status(400).json({ message: "Ticket type is required" });
    }
    if (!["VIP", "Regular"].includes(ticketType)) {
      return res.status(400).json({
        message: "Invalid ticket type. Must be 'VIP' or 'Regular'",
      });
    }
    const result = await bookingService.updateTicketType(id, ticketType);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Ticket type updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookings,
  getBooking,
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
