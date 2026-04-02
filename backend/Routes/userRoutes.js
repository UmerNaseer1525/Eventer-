const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const { authenticateToken } = require("../Middleware/authMiddleware");

// Public routes
router.post("/", userController.createUser); // Register
router.post("/login", userController.loginUser); // Login

// Protected routes - require authentication
router.get("/", authenticateToken, userController.getUsers);
router.get("/:email", authenticateToken, userController.getUserByEmail);
router.delete("/:email", authenticateToken, userController.deleteUser);
router.put(
  "/:email",
  authenticateToken,
  userController.updateUser,
);
router.put("/:email/status", authenticateToken, userController.updateStatus);

module.exports = router;
