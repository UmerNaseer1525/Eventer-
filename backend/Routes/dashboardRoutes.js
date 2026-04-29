const express = require("express");
const router = express.Router();
const dashboardController = require("../Controller/dashboardController");
const { authenticateToken } = require("../Middleware/authMiddleware");

router.use(authenticateToken);

router.get("/admin", dashboardController.getAdminDashboard);
router.get("/user/:userId", dashboardController.getUserDashboard);

module.exports = router;
