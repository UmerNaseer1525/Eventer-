const Event = require("../Model/Event");

const getAllEvents = async () => {
  return await Event.find({}).populate("organizer", "firstName lastName email phone");
};

const getEventById = async (eventId) => {
  return await Event.findById(eventId).populate(
    "organizer",
    "firstName lastName email phone",
  );
};

const getEventsByOrganizer = async (organizerId) => {
  return await Event.find({ organizer: organizerId }).populate(
    "organizer",
    "firstName lastName email phone",
  );
};

const getEventsByCategory = async (category) => {
  return await Event.find({ category }).populate(
    "organizer",
    "firstName lastName email phone",
  );
};

const getEventsByApprovalStatus = async (approvalStatus) => {
  return await Event.find({ isApproved: approvalStatus }).populate(
    "organizer",
    "firstName lastName email phone",
  );
};

const getEventsByStatus = async (status) => {
  return await Event.find({ status: status })
    .populate("organizer", "firstName lastName email")
    .populate("category", "name");
};

const createEvent = async (eventData) => {
  const event = new Event(eventData);
  const saved = await event.save();
  
  return await saved.populate(
    "organizer",
    "firstName lastName email phone"
  );
};

const deleteEvent = async (eventId) => {
  return await Event.deleteOne({ _id: eventId });
};

const updateEvent = async (eventId, updateData) => {
  return await Event.findByIdAndUpdate(eventId, updateData, { new: true }).populate(
    "organizer",
    "firstName lastName email phone",
  );
};

const updateStatus = async (eventId, status) => {
  return await Event.updateOne({ _id: eventId }, { $set: { status: status } });
};

const updateApprovalStatus = async (eventId, approvalStatus) => {
  return await Event.findByIdAndUpdate(
    eventId,
    { $set: { isApproved: approvalStatus } },
    { new: true }
  ).populate("organizer", "firstName lastName email phone");
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
