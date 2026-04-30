const Event = require("../Model/Event");
const Booking = require("../Model/Booking");
const Payment = require("../Model/Payment");
const User = require("../Model/User");

const getUserDashboard = async (userId) => {
  const userEvents = await Event.find({ organizer: userId })
    .populate("organizer", "firstName lastName email")
    .populate("category", "name");

  const userEventIds = userEvents.map((e) => e._id);
  const userBookings = await Booking.find({ event: { $in: userEventIds } })
    .populate("attendee", "firstName lastName email")
    .populate({
      path: "event",
      select: "title location date time",
    });

  const userPayments = await Payment.find({
    booking: { $in: userBookings.map((b) => b._id) },
  }).populate("booking", "totalPrice");

  const upcomingCount = userEvents.filter(
    (e) => String(e.status || "").toLowerCase() === "published",
  ).length;
  const completedCount = userEvents.filter(
    (e) => String(e.status || "").toLowerCase() === "completed",
  ).length;
  const cancelledCount = userEvents.filter(
    (e) => String(e.status || "").toLowerCase() === "cancelled",
  ).length;

  const totalRevenue = userPayments.reduce((sum, p) => {
    return sum + (Number(p.amount) || 0);
  }, 0);

  const paidBookings = userBookings.filter(
    (b) => b.paymentStatus === "paid",
  ).length;
  const pendingBookings = userBookings.filter(
    (b) => b.paymentStatus === "pending",
  ).length;

  return {
    stats: {
      totalEvents: userEvents.length,
      upcomingEvents: upcomingCount,
      completedEvents: completedCount,
      cancelledEvents: cancelledCount,
      totalBookings: userBookings.length,
      paidBookings,
      pendingBookings,
      totalRevenue,
    },
    recentEvents: userEvents.slice(0, 5),
    recentBookings: userBookings.slice(0, 5),
  };
};

const getAdminDashboard = async () => {
  const totalEvents = await Event.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalPayments = await Payment.countDocuments();
  const totalUsers = await User.countDocuments();

  const publishedEvents = await Event.countDocuments({
    status: "published",
  });
  const draftEvents = await Event.countDocuments({ status: "draft" });
  const cancelledEvents = await Event.countDocuments({
    status: "cancelled",
  });

  const paidBookings = await Booking.countDocuments({
    paymentStatus: "paid",
  });
  const pendingBookings = await Booking.countDocuments({
    paymentStatus: "pending",
  });
  const failedBookings = await Booking.countDocuments({
    paymentStatus: "failed",
  });

  const successfulPayments = await Payment.countDocuments({
    status: "success",
  });
  const failedPayments = await Payment.countDocuments({
    status: "failed",
  });

  const payments = await Payment.find({ status: "success" });
  const totalRevenue = payments.reduce((sum, p) => {
    return sum + (Number(p.amount) || 0);
  }, 0);

  const categoryAggregation = await Event.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const recentEvents = await Event.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("organizer", "firstName lastName email")
    .populate("category", "name");

  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("attendee", "firstName lastName email")
    .populate("event", "title");

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("firstName lastName email role status createdAt");

  return {
    stats: {
      totalEvents,
      publishedEvents,
      draftEvents,
      cancelledEvents,
      totalBookings,
      paidBookings,
      pendingBookings,
      failedBookings,
      totalPayments,
      successfulPayments,
      failedPayments,
      totalRevenue,
      totalUsers,
    },
    categoryBreakdown: categoryAggregation,
    recentEvents,
    recentBookings,
    recentUsers,
  };
};

module.exports = {
  getUserDashboard,
  getAdminDashboard,
};
