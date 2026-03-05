const express = require("express");
const router = express.Router();
const bookingController = require("../Controller/bookingController");

// Get routes
router.get("/", bookingController.getBookings);
router.get("/event/:eventId", bookingController.getBookingsByEvent);
router.get("/attendee/:attendeeId", bookingController.getBookingsByAttendee);
router.get(
  "/payment-status/:paymentStatus",
  bookingController.getBookingsByPaymentStatus,
);
router.get(
  "/ticket-type/:ticketType",
  bookingController.getBookingsByTicketType,
);
router.get("/:id", bookingController.getBooking);

// Post route
router.post("/", bookingController.createBooking);

// Put routes
router.put("/:id", bookingController.updateBooking);
router.put("/:id/payment-status", bookingController.updatePaymentStatus);
router.put("/:id/quantity", bookingController.updateQuantity);
router.put("/:id/total-price", bookingController.updateTotalPrice);
router.put("/:id/ticket-type", bookingController.updateTicketType);

// Delete route
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
