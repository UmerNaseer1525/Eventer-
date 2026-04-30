const Event = require("../Model/Event");
const Booking = require("../Model/Booking");
const Payment = require("../Model/Payment");
const User = require("../Model/User");

const getAnalytics = async (organizerId = null) => {
  try {
    // Base query filter
    const eventFilter = organizerId ? { organizer: organizerId } : {};

    // Get all events
    const events = await Event.find(eventFilter)
      .populate("organizer", "firstName lastName email")
      .populate("category", "name")
      .lean();

    // Use all stored events so analytics matches the database record count
    const reportEvents = events;

    const eventIds = reportEvents.map((e) => e._id);

    // Get bookings for all events in the report
    const bookings = await Booking.find({
      event: { $in: eventIds },
    })
      .populate("attendee", "firstName lastName email")
      .populate("event", "title")
      .lean();

    // Filter paid bookings
    const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");

    // Get payments for paid bookings
    const bookingIds = paidBookings.map((b) => b._id);
    const payments = await Payment.find({
      booking: { $in: bookingIds },
      status: "completed",
    })
      .populate("booking", "totalPrice")
      .lean();

    // Calculate statistics
    const stats = calculateStats(reportEvents, paidBookings, payments);

    // Build timeline data for charts
    const timelineData = buildTimelineData(reportEvents, paidBookings, payments);

    // Calculate category breakdown
    const categoryBreakdown = calculateCategoryBreakdown(reportEvents);

    // Calculate status breakdown
    const statusBreakdown = calculateStatusBreakdown(reportEvents);

    // Get top events
    const topEvents = calculateTopEvents(
      reportEvents,
      paidBookings,
      payments
    );

    // Calculate additional metrics
    const additionalMetrics = calculateAdditionalMetrics(
      reportEvents,
      paidBookings,
      payments
    );

    return {
      stats,
      timelineData,
      categoryBreakdown,
      statusBreakdown,
      topEvents,
      additionalMetrics,
      rawData: {
        events: reportEvents.length,
        bookings: paidBookings.length,
        payments: payments.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }
};

const calculateStats = (events, bookings, payments) => {
  const totalRevenue = payments.reduce((sum, p) => {
    return sum + (Number(p.amount) || 0);
  }, 0);

  const upcomingCount = events.filter(
    (e) => String(e.status || "").toLowerCase() === "upcoming"
  ).length;

  const ongoingCount = events.filter(
    (e) => String(e.status || "").toLowerCase() === "ongoing"
  ).length;

  const completedCount = events.filter(
    (e) => String(e.status || "").toLowerCase() === "completed"
  ).length;

  const cancelledCount = events.filter(
    (e) => String(e.status || "").toLowerCase() === "cancelled"
  ).length;

  return {
    totalEvents: events.length,
    totalBookings: bookings.length,
    totalRevenue,
    totalPayments: payments.length,
    upcomingEvents: upcomingCount,
    ongoingEvents: ongoingCount,
    completedEvents: completedCount,
    cancelledEvents: cancelledCount,
  };
};

const buildTimelineData = (events, bookings, payments) => {
  const monthlyData = {};

  // Initialize months
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    monthlyData[monthKey] = { month: monthKey, events: 0, bookings: 0, revenue: 0 };
  }

  // Count events by month
  events.forEach((event) => {
    if (event.createdAt) {
      const date = new Date(event.createdAt);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].events += 1;
      }
    }
  });

  // Count bookings by month
  bookings.forEach((booking) => {
    if (booking.createdAt) {
      const date = new Date(booking.createdAt);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].bookings += 1;
      }
    }
  });

  // Sum revenue by month
  payments.forEach((payment) => {
    if (payment.createdAt) {
      const date = new Date(payment.createdAt);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].revenue += Number(payment.amount) || 0;
      }
    }
  });

  return Object.values(monthlyData);
};

const calculateCategoryBreakdown = (events) => {
  const categoryMap = {};

  events.forEach((event) => {
    const categoryName = event.category?.name || "Uncategorized";
    categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
  });

  return Object.entries(categoryMap).map(([name, count]) => ({
    name,
    value: count,
  }));
};

const calculateStatusBreakdown = (events) => {
  const statusMap = {
    Upcoming: 0,
    Ongoing: 0,
    Completed: 0,
    Cancelled: 0,
  };

  events.forEach((event) => {
    const status = String(event.status || "").toLowerCase();
    if (status === "upcoming") statusMap.Upcoming += 1;
    else if (status === "ongoing") statusMap.Ongoing += 1;
    else if (status === "completed") statusMap.Completed += 1;
    else if (status === "cancelled") statusMap.Cancelled += 1;
  });

  return Object.entries(statusMap).map(([name, value]) => ({
    name,
    value,
  }));
};

const calculateTopEvents = (events, bookings, payments) => {
  const bookingByEvent = {};
  const revenueByEvent = {};

  bookings.forEach((booking) => {
    const eventId = String(booking.event?._id || booking.eventId || "");
    bookingByEvent[eventId] = (bookingByEvent[eventId] || 0) + 1;
  });

  payments.forEach((payment) => {
    // Try to find event through booking
    const bookingId = payment.booking?._id;
    const booking = bookings.find((b) => String(b._id) === String(bookingId));
    const eventId = booking
      ? String(booking.event?._id || "")
      : String(payment.eventId || "");

    if (eventId) {
      revenueByEvent[eventId] = (revenueByEvent[eventId] || 0) + (Number(payment.amount) || 0);
    }
  });

  const topEvents = events
    .map((event) => {
      const eventIdStr = String(event._id);
      return {
        _id: event._id,
        name: event.title || event.name || "Untitled Event",
        category: event.category?.name || "Uncategorized",
        status: event.status || "Unknown",
        bookings: bookingByEvent[eventIdStr] || 0,
        revenue: revenueByEvent[eventIdStr] || 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return topEvents;
};

const calculateAdditionalMetrics = (events, bookings, payments) => {
  const avgBookingsPerEvent =
    events.length > 0 ? (bookings.length / events.length).toFixed(2) : 0;

  const avgRevenuePerEvent =
    events.length > 0
      ? (
          payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) /
          events.length
        ).toFixed(2)
      : 0;

  const avgRevenuePerBooking =
    bookings.length > 0
      ? (
          payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) /
          bookings.length
        ).toFixed(2)
      : 0;

  const conversionRate =
    events.length > 0
      ? ((bookings.length / (events.length * 350)) * 100).toFixed(2)
      : 0;

  return {
    avgBookingsPerEvent: parseFloat(avgBookingsPerEvent),
    avgRevenuePerEvent: parseFloat(avgRevenuePerEvent),
    avgRevenuePerBooking: parseFloat(avgRevenuePerBooking),
    conversionRate: parseFloat(conversionRate),
  };
};

const getOrganizerAnalytics = async (organizerId) => {
  return await getAnalytics(organizerId);
};

module.exports = {
  getAnalytics,
  getOrganizerAnalytics,
};
