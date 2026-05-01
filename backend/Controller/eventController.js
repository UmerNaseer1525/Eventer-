const eventService = require("../Services/eventService");
const notificationService = require("../Services/notificationService");

async function createEventNotification(notificationData) {
  try {
    await notificationService.createNotification(notificationData);
  } catch (error) {
    console.error("Failed to create event notification:", error.message);
  }
}

const getEvents = async (req, res) => {
  try {
    const { excludeOrganizerId } = req.query;
    const events = await eventService.getAllEvents(excludeOrganizerId || null);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventsByOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const events = await eventService.getEventsByOrganizer(organizerId);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = categoryId;
    const events = await eventService.getEventsByCategory(category);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventsByApprovalStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: "Invalid approval status. Must be 'pending', 'approved', or 'rejected'",
      });
    }
    const events = await eventService.getEventsByApprovalStatus(status);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    if (!["draft", "published", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'draft', 'published', or 'cancelled'",
      });
    }
    const events = await eventService.getEventsByStatus(status);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body);
    if(!event) {
      return res.status(400).json({message:"event not created"})
    }

    await createEventNotification({
      target: "admin",
      type: "event",
      category: "Event",
      title: `New event request: ${event.title}`,
      message: `${event.organizer?.firstName || "A user"} submitted a new event for approval.`,
      relatedId: event._id,
      relatedModel: "Event",
    });

    res.status(201).json({ message: "Event created successfully", event: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eventService.deleteEvent(id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await eventService.updateEvent(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully", event: updated });
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
    if (!["Upcoming", "Completed", "Cancelled", "Ongoing"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'Upcoming', 'Completed', 'Ongoing' or 'Cancelled'",
      });
    }
    const result = await eventService.updateStatus(id, status);
    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (result.organizer) {
      await createEventNotification({
        recipient: result.organizer._id,
        target: "user",
        type: "info",
        category: "Event",
        title: `Event status updated: ${result.title}`,
        message: `Your event status changed to ${status.toLowerCase()}.`,
        relatedId: result._id,
        relatedModel: "Event",
      });
    }

    res.status(200).json({ message: "Event status updated successfully", event: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Approval status is required" });
    }
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: "Invalid approval status. Must be 'pending', 'approved', or 'rejected'",
      });
    }
    const result = await eventService.updateApprovalStatus(id, status);
    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (status === "pending") {
      await createEventNotification({
        target: "admin",
        type: "warning",
        category: "Event",
        title: `Event moved back to pending: ${result.title}`,
        message: `An event has been moved back to the pending approval queue.`,
        relatedId: result._id,
        relatedModel: "Event",
      });
    } else if (result.organizer) {
      const notificationTitle =
        status === "approved"
          ? `Event approved: ${result.title}`
          : `Event rejected: ${result.title}`;
      const notificationMessage =
        status === "approved"
          ? "Your event has been approved and is now visible to attendees."
          : "Your event was rejected. Please review the feedback and update it if needed.";

      await createEventNotification({
        recipient: result.organizer._id,
        target: "user",
        type: status === "approved" ? "event" : "warning",
        category: "Event",
        title: notificationTitle,
        message: notificationMessage,
        relatedId: result._id,
        relatedModel: "Event",
      });
    }

    res.status(200).json({ message: "Approval status updated successfully", event: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBannerImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { bannerImage } = req.body;
    if (!bannerImage) {
      return res.status(400).json({ message: "Banner image URL is required" });
    }
    const result = await eventService.updateBannerImage(id, bannerImage);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Banner image updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicketPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticketPrice } = req.body;
    if (ticketPrice === undefined || ticketPrice === null) {
      return res.status(400).json({ message: "Ticket price is required" });
    }
    if (ticketPrice < 0) {
      return res
        .status(400)
        .json({ message: "Ticket price cannot be negative" });
    }
    const result = await eventService.updateTicketPrice(id, ticketPrice);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Ticket price updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCapacity = async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity } = req.body;
    if (capacity === undefined || capacity === null) {
      return res.status(400).json({ message: "Capacity is required" });
    }
    if (capacity < 0) {
      return res.status(400).json({ message: "Capacity cannot be negative" });
    }
    const result = await eventService.updateCapacity(id, capacity);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Capacity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDateTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;
    if (!date && !time) {
      return res.status(400).json({
        message: "At least one field (date or time) is required",
      });
    }
    const result = await eventService.updateDateTime(id, date, time);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Date/time updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEvent,
  getEventsByOrganizer,
  getEventsByCategory,
  getEventsByStatus,
  getEventsByApprovalStatus,
  createEvent,
  deleteEvent,
  updateEvent,
  updateStatus,
  updateApprovalStatus,
  updateBannerImage,
  updateTicketPrice,
  updateCapacity,
  updateDateTime,
};
