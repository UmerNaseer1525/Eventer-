const Event = require("../Model/Event");

const organizerPopulate = {
  path: "organizer",
  select: "firstName lastName email phone",
  options: { excludeId: true },
};

const getAllEvents = async (excludeOrganizerId = null) => {
  const filter = excludeOrganizerId
    ? { organizer: { $ne: excludeOrganizerId } }
    : {};

  return await Event.find(filter).populate(organizerPopulate);
};

const getEventById = async (eventId) => {
  return await Event.findById(eventId).populate(organizerPopulate);
};

const getEventsByOrganizer = async (organizerId) => {
  return await Event.find({ organizer: organizerId }).populate(organizerPopulate);
};

const getEventsByCategory = async (category) => {
  return await Event.find({ category }).populate(organizerPopulate);
};

const getEventsByApprovalStatus = async (approvalStatus) => {
  return await Event.find({ isApproved: approvalStatus }).populate(organizerPopulate);
};

const getEventsByStatus = async (status) => {
  return await Event.find({ status: status }).populate(organizerPopulate);
};

const createEvent = async (eventData) => {
  const event = new Event(eventData);
  const saved = await event.save();
  
  return await saved.populate(organizerPopulate);
};

const deleteEvent = async (eventId) => {
  return await Event.deleteOne({ _id: eventId });
};

const updateEvent = async (eventId, updateData) => {
  return await Event.findByIdAndUpdate(eventId, updateData, { new: true }).populate(
    organizerPopulate,
  );
};

const updateStatus = async (eventId, status) => {
  return await Event.findByIdAndUpdate(
    eventId,
    { $set: { status: status } },
    { new: true }
  ).populate(organizerPopulate);
};

const updateApprovalStatus = async (eventId, approvalStatus) => {
  return await Event.findByIdAndUpdate(
    eventId,
    { $set: { isApproved: approvalStatus } },
    { new: true }
  ).populate(organizerPopulate);
};

const updateBannerImage = async (eventId, bannerImage) => {
  return await Event.findByIdAndUpdate(
    eventId,
    { $set: { bannerImage: bannerImage } },
    { new: true }
  ).populate(organizerPopulate);
};

const updateTicketPrice = async (eventId, ticketPrice) => {
  return await Event.findByIdAndUpdate(
    eventId,
    { $set: { ticketPrice: ticketPrice } },
    { new: true }
  ).populate(organizerPopulate);
};

const updateCapacity = async (eventId, capacity) => {
  return await Event.findByIdAndUpdate(
    eventId,
    { $set: { capacity: capacity } },
    { new: true }
  ).populate(organizerPopulate);
};

const updateDateTime = async (eventId, date, time) => {
  const updateFields = {};
  if (date) updateFields.date = date;
  if (time) updateFields.time = time;
  return await Event.findByIdAndUpdate(
    eventId,
    { $set: updateFields },
    { new: true }
  ).populate(organizerPopulate);
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
