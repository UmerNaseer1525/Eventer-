const Event = require("../Model/Event");

const getAllEvents = async () => {
  return await Event.find({})
    .populate("organizer", "firstName lastName email")
    .populate("category", "name");
};

const getEventById = async (eventId) => {
  return await Event.findById(eventId)
    .populate("organizer", "firstName lastName email phone")
    .populate("category", "name description");
};

const getEventsByOrganizer = async (organizerId) => {
  return await Event.find({ organizer: organizerId }).populate(
    "category",
    "name",
  );
};

const getEventsByCategory = async (categoryId) => {
  return await Event.find({ category: categoryId }).populate(
    "organizer",
    "firstName lastName email",
  );
};

const getEventsByStatus = async (status) => {
  return await Event.find({ status: status })
    .populate("organizer", "firstName lastName email")
    .populate("category", "name");
};

const createEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};

const deleteEvent = async (eventId) => {
  return await Event.deleteOne({ _id: eventId });
};

const updateEvent = async (eventId, updateData) => {
  return await Event.updateOne({ _id: eventId }, { $set: updateData });
};

const updateStatus = async (eventId, status) => {
  return await Event.updateOne({ _id: eventId }, { $set: { status: status } });
};

const updateBannerImage = async (eventId, bannerImage) => {
  return await Event.updateOne(
    { _id: eventId },
    { $set: { bannerImage: bannerImage } },
  );
};

const updateTicketPrice = async (eventId, ticketPrice) => {
  return await Event.updateOne(
    { _id: eventId },
    { $set: { ticketPrice: ticketPrice } },
  );
};

const updateCapacity = async (eventId, capacity) => {
  return await Event.updateOne(
    { _id: eventId },
    { $set: { capacity: capacity } },
  );
};

const updateDateTime = async (eventId, date, time) => {
  const updateFields = {};
  if (date) updateFields.date = date;
  if (time) updateFields.time = time;
  return await Event.updateOne({ _id: eventId }, { $set: updateFields });
};

module.exports = {
  getAllEvents,
  getEventById,
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
