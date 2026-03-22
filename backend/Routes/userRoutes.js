const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const { authenticateToken } = require("../Middleware/authMiddleware");
const upload = require("../Middleware/uploadMiddleware");

// Public routes
router.post("/", upload.single("profileImage"), userController.createUser); // Register
router.post("/login", userController.loginUser); // Login

// Protected routes - require authentication
router.get("/", authenticateToken, userController.getUsers);
router.get("/:email", authenticateToken, userController.getUserByEmail);
router.delete("/:email", authenticateToken, userController.deleteUser);
router.put(
  "/:email",
  authenticateToken,
  upload.single("profileImage"),
  userController.updateUser,
);
router.put("/:email/status", authenticateToken, userController.updateStatus);

module.exports = router;
