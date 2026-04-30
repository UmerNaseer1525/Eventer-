const Event = require("../Model/Event");
const Booking = require("../Model/Booking");
const Payment = require("../Model/Payment");
const User = require("../Model/User");

const generateReportData = async (organizerId = null, dateRange = null) => {
  try {
    // Base query filter
    const eventFilter = organizerId ? { organizer: organizerId } : {};

    // Apply date range filter if provided
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      eventFilter.createdAt = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate),
      };
    }

    console.log("[ReportsService] Fetching events with filter:", eventFilter);

    // Get all events - don't populate category as it might be a string in database
    let events = await Event.find(eventFilter)
      .populate("organizer", "firstName lastName email")
      .lean();

    console.log("[ReportsService] Found events:", events.length);

    // Enhance events with category name directly from stored data.
    events = events.map(e => ({
      ...e,
      categoryName: typeof e.category === "string"
        ? e.category
        : e.category?.name || e.category?.title || "Uncategorized",
    }));

    console.log("[ReportsService] Events with categories resolved:", events.length);

    // Use all stored events for reporting so the totals match the database
    const reportEvents = events;

    console.log("[ReportsService] Report events:", reportEvents.length);

    const eventIds = reportEvents.map((e) => e._id);

    // Get bookings for approved events
    const bookings = await Booking.find({
      event: { $in: eventIds },
    })
      .populate("attendee", "firstName lastName email")
      .populate("event", "title")
      .lean();

    console.log("[ReportsService] Found bookings:", bookings.length);

    // Get payments
    const bookingIds = bookings.map((b) => b._id);
    const payments = await Payment.find({
      booking: { $in: bookingIds },
    })
      .populate("booking", "totalPrice")
      .lean();

    console.log("[ReportsService] Found payments:", payments.length);

    // Calculate comprehensive statistics
    const stats = calculateDetailedStats(reportEvents, bookings, payments);

    // Build timeline data
    const timelineData = buildTimelineData(reportEvents, bookings, payments);

    // Calculate category breakdown
    const categoryBreakdown = calculateCategoryBreakdown(
      reportEvents,
      bookings,
      payments
    );

    // Calculate status breakdown
    const statusBreakdown = calculateStatusBreakdown(reportEvents);

    // Get top events
    const topEvents = calculateTopEvents(reportEvents, bookings, payments);

    // Get top attendees
    const topAttendees = calculateTopAttendees(bookings);

    // Calculate additional metrics
    const additionalMetrics = calculateAdditionalMetrics(
      reportEvents,
      bookings,
      payments
    );

    // Get detailed event list
    const eventDetails = getEventDetails(
      reportEvents,
      bookings,
      payments
    );

    // Get detailed booking list
    const bookingDetails = getBookingDetails(bookings, payments);

    return {
      reportGeneratedAt: new Date().toISOString(),
      reportPeriod: dateRange ? `${dateRange.startDate} to ${dateRange.endDate}` : "All Time",
      organizerId: organizerId || "System",
      stats,
      timelineData,
      categoryBreakdown,
      statusBreakdown,
      topEvents,
      topAttendees,
      additionalMetrics,
      eventDetails,
      bookingDetails,
      rawCounts: {
        totalEvents: reportEvents.length,
        totalBookings: bookings.length,
        totalPayments: payments.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate report: ${error.message}`);
  }
};

const calculateDetailedStats = (events, bookings, payments) => {
  const totalRevenue = payments.reduce((sum, p) => {
    return sum + (Number(p.amount) || 0);
  }, 0);

  const completedPayments = payments.filter(
    (p) => p.status === "completed"
  ).length;

  const pendingPayments = payments.filter(
    (p) => p.status === "pending"
  ).length;

  const failedPayments = payments.filter(
    (p) => p.status === "failed"
  ).length;

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

  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid").length;
  const pendingBookings = bookings.filter((b) => b.paymentStatus === "pending").length;
  const cancelledBookings = bookings.filter(
    (b) => String(b.status || "").toLowerCase() === "cancelled"
  ).length;

  return {
    totalEvents: events.length,
    totalBookings: bookings.length,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalPayments: payments.length,
    completedPayments,
    pendingPayments,
    failedPayments,
    upcomingEvents: upcomingCount,
    ongoingEvents: ongoingCount,
    completedEvents: completedCount,
    cancelledEvents: cancelledCount,
    paidBookings,
    pendingBookings,
    cancelledBookings,
    conversionRate: events.length > 0
      ? parseFloat(((bookings.length / (events.length * 100)) * 100).toFixed(2))
      : 0,
  };
};

const buildTimelineData = (events, bookings, payments) => {
  const monthlyData = {};

  // Initialize months (last 12)
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    monthlyData[monthKey] = {
      month: monthKey,
      events: 0,
      bookings: 0,
      revenue: 0,
      cancelled: 0,
      date: date.toISOString(),
    };
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
        if (String(booking.status || "").toLowerCase() === "cancelled") {
          monthlyData[monthKey].cancelled += 1;
        }
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

  return Object.values(monthlyData).map((data) => ({
    ...data,
    revenue: parseFloat(data.revenue.toFixed(2)),
  }));
};

const calculateCategoryBreakdown = (events, bookings, payments) => {
  const categoryMap = {};

  events.forEach((event) => {
    // Use the pre-resolved categoryName
    const categoryName = event.categoryName || "Uncategorized";
    const categoryKey = String(categoryName);
    
    if (!categoryMap[categoryKey]) {
      categoryMap[categoryKey] = {
        name: categoryKey,
        events: 0,
        bookings: 0,
        revenue: 0,
      };
    }
    categoryMap[categoryKey].events += 1;
  });

  bookings.forEach((booking) => {
    const eventId = String(booking.event?._id || booking.eventId || "");
    const event = events.find((e) => String(e._id) === eventId);
    const categoryName = event?.categoryName || "Uncategorized";
    const categoryKey = String(categoryName);

    if (categoryMap[categoryKey]) {
      categoryMap[categoryKey].bookings += 1;
    }
  });

  payments.forEach((payment) => {
    const bookingId = payment.booking?._id;
    const booking = bookings.find((b) => String(b._id) === String(bookingId));
    const eventId = booking ? String(booking.event?._id || booking.eventId || "") : "";
    const event = events.find((e) => String(e._id) === eventId);
    const categoryName = event?.categoryName || "Uncategorized";
    const categoryKey = String(categoryName);

    if (categoryMap[categoryKey]) {
      categoryMap[categoryKey].revenue += Number(payment.amount) || 0;
    }
  });

  return Object.values(categoryMap).map((item) => ({
    ...item,
    revenue: parseFloat(item.revenue.toFixed(2)),
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
        category: event.categoryName || "Uncategorized",
        status: event.status || "Unknown",
        date: event.eventDate,
        bookings: bookingByEvent[eventIdStr] || 0,
        revenue: revenueByEvent[eventIdStr] || 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map((item) => ({
      ...item,
      revenue: parseFloat(item.revenue.toFixed(2)),
    }));

  return topEvents;
};

const calculateTopAttendees = (bookings) => {
  const attendeeMap = {};

  bookings.forEach((booking) => {
    const attendeeId = String(booking.attendee?._id || booking.attendeeId || "");
    const attendeeName = `${booking.attendee?.firstName || "Unknown"} ${
      booking.attendee?.lastName || ""
    }`;
    const attendeeEmail = booking.attendee?.email || "N/A";

    if (!attendeeMap[attendeeId]) {
      attendeeMap[attendeeId] = {
        name: attendeeName,
        email: attendeeEmail,
        bookings: 0,
      };
    }
    attendeeMap[attendeeId].bookings += 1;
  });

  return Object.values(attendeeMap)
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 10);
};

const calculateAdditionalMetrics = (events, bookings, payments) => {
  const avgBookingsPerEvent =
    events.length > 0 ? (bookings.length / events.length).toFixed(2) : 0;

  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const avgRevenuePerEvent =
    events.length > 0 ? (totalRevenue / events.length).toFixed(2) : 0;

  const avgRevenuePerBooking =
    bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : 0;

  const cancellationRate =
    bookings.length > 0
      ? (
          (bookings.filter((b) => String(b.status || "").toLowerCase() === "cancelled")
            .length / bookings.length) *
          100
        ).toFixed(2)
      : 0;

  return {
    avgBookingsPerEvent: parseFloat(avgBookingsPerEvent),
    avgRevenuePerEvent: parseFloat(avgRevenuePerEvent),
    avgRevenuePerBooking: parseFloat(avgRevenuePerBooking),
    cancellationRate: parseFloat(cancellationRate),
  };
};

const getEventDetails = (events, bookings, payments) => {
  const bookingByEvent = {};
  const revenueByEvent = {};

  bookings.forEach((booking) => {
    const eventId = String(booking.event?._id || booking.eventId || "");
    bookingByEvent[eventId] = (bookingByEvent[eventId] || 0) + 1;
  });

  payments.forEach((payment) => {
    const bookingId = payment.booking?._id;
    const booking = bookings.find((b) => String(b._id) === String(bookingId));
    const eventId = booking
      ? String(booking.event?._id || "")
      : String(payment.eventId || "");

    if (eventId) {
      revenueByEvent[eventId] = (revenueByEvent[eventId] || 0) + (Number(payment.amount) || 0);
    }
  });

  return events.slice(0, 50).map((event) => {
    const eventIdStr = String(event._id);
    return {
      _id: event._id,
      title: event.title || "Untitled Event",
      category: event.categoryName || "Uncategorized",
      status: event.status || "Unknown",
      eventDate: event.eventDate,
      createdAt: event.createdAt,
      organizer: `${event.organizer?.firstName || ""} ${event.organizer?.lastName || ""}`,
      bookings: bookingByEvent[eventIdStr] || 0,
      revenue: parseFloat((revenueByEvent[eventIdStr] || 0).toFixed(2)),
    };
  });
};

const getBookingDetails = (bookings, payments) => {
  const paymentByBooking = {};

  payments.forEach((payment) => {
    const bookingId = String(payment.booking?._id || payment.bookingId || "");
    paymentByBooking[bookingId] = {
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.createdAt,
    };
  });

  return bookings.slice(0, 50).map((booking) => {
    const bookingIdStr = String(booking._id);
    const payment = paymentByBooking[bookingIdStr] || {};

    return {
      _id: booking._id,
      attendee: `${booking.attendee?.firstName || ""} ${booking.attendee?.lastName || ""}`,
      email: booking.attendee?.email || "N/A",
      event: booking.event?.title || "N/A",
      status: booking.status || "active",
      paymentStatus: booking.paymentStatus || "pending",
      amount: payment.amount || booking.totalPrice || 0,
      paymentDate: payment.paymentDate,
      createdAt: booking.createdAt,
    };
  }).map((item) => ({
    ...item,
    amount: parseFloat(item.amount.toFixed(2)),
  }));
};

module.exports = {
  generateReportData,
  calculateDetailedStats,
  buildTimelineData,
  calculateCategoryBreakdown,
  calculateStatusBreakdown,
  calculateTopEvents,
  calculateTopAttendees,
  calculateAdditionalMetrics,
  getEventDetails,
  getBookingDetails,
};
