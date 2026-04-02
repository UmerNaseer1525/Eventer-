const eventService = require("../Services/eventService");

const getEvents = async (req, res) => {
  try {
    const events = await eventService
      .getAllEvents()
      .populate("organizer", "firstName lastName email phone");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventService
      .getEventById(id)
      .populate("organizer", "firstName lastName email phone");
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
    const events = await eventService.getEventsByCategory(categoryId);
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
    res.status(201).json({
      message: "Event created successfully",
      eventId: event._id,
    });
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
    const result = await eventService.updateEvent(id, req.body);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully" });
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
        message: "Invalid status. Must be 'draft', 'published', or 'cancelled'",
      });
    }
    const result = await eventService.updateStatus(id, status);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event status updated successfully" });
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
  createEvent,
  deleteEvent,
  updateEvent,
  updateStatus,
  updateBannerImage,
  updateTicketPrice,
  updateCapacity,
  updateDateTime,
};
