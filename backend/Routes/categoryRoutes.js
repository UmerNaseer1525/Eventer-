const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/categoryController");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", categoryController.createCategory);
router.delete("/:id", categoryController.deleteCategory);
router.put("/:id/name", categoryController.updateName);
router.put("/:id/description", categoryController.updateDescription);

module.exports = router;
