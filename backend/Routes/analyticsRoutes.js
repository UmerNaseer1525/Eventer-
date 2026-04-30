const express = require("express");
const router = express.Router();
const analyticsController = require("../Controller/analyticsController");
const { authenticateToken } = require("../Middleware/authMiddleware");

// Protected routes - require authentication
router.get("/", authenticateToken, analyticsController.getAnalytics);
router.get(
  "/organizer/:organizerId",
  authenticateToken,
  analyticsController.getOrganizerAnalytics
);

module.exports = router;
