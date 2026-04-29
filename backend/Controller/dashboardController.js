const dashboardService = require("../Services/dashboardService");

const getUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const dashboard = await dashboardService.getUserDashboard(userId);
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const dashboard = await dashboardService.getAdminDashboard();
    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserDashboard,
  getAdminDashboard,
};
