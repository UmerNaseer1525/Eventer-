const express = require("express");
const router = express.Router();
const paymentController = require("../Controller/paymentController");

// Get routes
router.get("/", paymentController.getPayments);
router.get("/booking/:bookingId", paymentController.getPaymentsByBooking);
router.get("/method/:method", paymentController.getPaymentsByMethod);
router.get("/status/:status", paymentController.getPaymentsByStatus);
router.get("/:id", paymentController.getPayment);

// Post route
router.post("/", paymentController.createPayment);

// Put routes
router.put("/:id", paymentController.updatePayment);
router.put("/:id/status", paymentController.updateStatus);
router.put("/:id/amount", paymentController.updateAmount);
router.put("/:id/paid-at", paymentController.updatePaidAt);

// Delete route
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
