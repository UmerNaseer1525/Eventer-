const analyticsService = require("../Services/analyticsService");

const getAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getAnalytics();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrganizerAnalytics = async (req, res) => {
  try {
    const { organizerId } = req.params;
    if (!organizerId) {
      return res.status(400).json({ message: "Organizer ID is required" });
    }

    const analytics = await analyticsService.getOrganizerAnalytics(organizerId);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getOrganizerAnalytics,
};
