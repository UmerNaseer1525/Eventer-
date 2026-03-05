const paymentService = require("../Services/paymentService");

const getPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payments = await paymentService.getPaymentsByBooking(bookingId);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentsByMethod = async (req, res) => {
  try {
    const { method } = req.params;
    if (!["card", "jazzcash", "easypaisa"].includes(method)) {
      return res.status(400).json({
        message:
          "Invalid payment method. Must be 'card', 'jazzcash', or 'easypaisa'",
      });
    }
    const payments = await paymentService.getPaymentsByMethod(method);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!["success", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'success' or 'failed'",
      });
    }
    const payments = await paymentService.getPaymentsByStatus(status);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({
      message: "Payment created successfully",
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await paymentService.deletePayment(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await paymentService.updatePayment(id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (!["success", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'success' or 'failed'",
      });
    }
    const result = await paymentService.updateStatus(id, status);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: "Amount is required" });
    }
    if (amount < 0) {
      return res.status(400).json({ message: "Amount cannot be negative" });
    }
    const result = await paymentService.updateAmount(id, amount);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Amount updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaidAt = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAt } = req.body;
    if (!paidAt) {
      return res.status(400).json({ message: "Paid at date is required" });
    }
    const result = await paymentService.updatePaidAt(id, paidAt);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Paid at date updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  getPayment,
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
