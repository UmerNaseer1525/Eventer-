const express = require("express");
const router = express.Router();
const eventController = require("../Controller/eventController");

router.get("/", eventController.getEvents);
router.get("/organizer/:organizerId", eventController.getEventsByOrganizer);
router.get("/category/:categoryId", eventController.getEventsByCategory);
router.get("/status/:status", eventController.getEventsByStatus);
router.get(
	"/approval/:status",
	eventController.getEventsByApprovalStatus,
);
router.get("/:id", eventController.getEvent);

router.post("/", eventController.createEvent);

router.put("/:id", eventController.updateEvent);
router.put("/:id/status", eventController.updateStatus);
router.put("/:id/approval", eventController.updateApprovalStatus);
router.put("/:id/banner-image", eventController.updateBannerImage);
router.put("/:id/date-time", eventController.updateDateTime);
router.put("/:id/ticket-price", eventController.updateTicketPrice);
router.put("/:id/capacity", eventController.updateCapacity);

router.delete("/:id", eventController.deleteEvent);

module.exports = router;
