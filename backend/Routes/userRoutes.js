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
  "/:email/password",
  authenticateToken,
  userController.updatePassword,
);
router.put(
  "/:email/profile-image",
  authenticateToken,
  userController.updateProfileImage,
);
router.put("/:email/status", authenticateToken, userController.updateStatus);
router.put("/:email/phone", authenticateToken, userController.updatePhone);
router.put("/:email/name", authenticateToken, userController.updateName);
router.put(
  "/:email/user-name",
  authenticateToken,
  userController.updateUsername,
);

module.exports = router;
