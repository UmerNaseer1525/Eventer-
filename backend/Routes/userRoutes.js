const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id/password", userController.updatePassword);
router.put("/:id/profile-image", userController.updateProfileImage);
router.put("/:id/status", userController.updateStatus);
router.put("/:id/phone", userController.updatePhone);
router.put("/:id/name", userController.updateName);

module.exports = router;
