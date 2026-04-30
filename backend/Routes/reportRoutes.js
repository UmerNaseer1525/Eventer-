const express = require("express");
const router = express.Router();
const reportController = require("../Controller/reportController");
const { authenticateToken } = require("../Middleware/authMiddleware");

// Protected routes - require authentication
router.get("/", authenticateToken, reportController.getReports);
router.get("/organizer/:organizerId", authenticateToken, reportController.getOrganizerReports);
router.get("/date-range/filter", authenticateToken, reportController.getReportsByDateRange);

// Download routes
router.get("/download/system", authenticateToken, reportController.downloadReport);
router.get("/download/organizer", authenticateToken, reportController.downloadOrganizerReport);

module.exports = router;
