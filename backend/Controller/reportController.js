const reportsService = require("../Services/reportsService");

const getReports = async (req, res) => {
  try {
    console.log("[Reports API] Fetching system-wide reports...");
    const reportData = await reportsService.generateReportData();
    console.log("[Reports API] Reports generated successfully");
    res.status(200).json(reportData);
  } catch (error) {
    console.error("[Reports API ERROR]", error);
    res.status(500).json({ message: error.message || "Failed to generate reports" });
  }
};

const getOrganizerReports = async (req, res) => {
  try {
    const { organizerId } = req.params;
    if (!organizerId) {
      return res.status(400).json({ message: "Organizer ID is required" });
    }

    console.log("[Reports API] Fetching organizer reports for:", organizerId);
    const reportData = await reportsService.generateReportData(organizerId);
    console.log("[Reports API] Organizer reports generated successfully");
    res.status(200).json(reportData);
  } catch (error) {
    console.error("[Reports API ERROR]", error);
    res.status(500).json({ message: error.message || "Failed to generate organizer reports" });
  }
};

const getReportsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, organizerId } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    console.log("[Reports API] Fetching reports for date range:", { startDate, endDate, organizerId });
    const dateRange = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    const reportData = await reportsService.generateReportData(
      organizerId || null,
      dateRange
    );
    console.log("[Reports API] Date-range reports generated successfully");
    res.status(200).json(reportData);
  } catch (error) {
    console.error("[Reports API ERROR]", error);
    res.status(500).json({ message: error.message || "Failed to generate date-range reports" });
  }
};

const downloadReport = async (req, res) => {
  try {
    const { format } = req.query;
    console.log("[Download Report] Received request with format:", format);
    
    if (!format) {
      console.log("[Download Report] Format parameter missing");
      return res.status(400).json({ message: "format parameter is required (pdf or txt)" });
    }

    const reportData = await reportsService.generateReportData();
    console.log("[Download Report] Report data generated successfully");

    if (format === "pdf") {
      console.log("[Download Report] Generating PDF...");
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument();
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="report-${new Date().getTime()}.pdf"`
      );

      doc.pipe(res);
      
      // Title
      doc.fontSize(20).font("Helvetica-Bold").text("Event Reports", 100, 50);
      doc.fontSize(10).font("Helvetica").text(`Generated: ${reportData.reportGeneratedAt}`, 100, 80);
      doc.text(`Period: ${reportData.reportPeriod}`, 100, 95);
      
      // Statistics
      doc.fontSize(14).font("Helvetica-Bold").text("Statistics", 100, 130);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Total Events: ${reportData.stats.totalEvents}`, 120, 155);
      doc.text(`Total Bookings: ${reportData.stats.totalBookings}`, 120, 170);
      doc.text(`Total Revenue: $${reportData.stats.totalRevenue}`, 120, 185);
      doc.text(`Total Payments: ${reportData.stats.totalPayments}`, 120, 200);
      doc.text(`Completed Payments: ${reportData.stats.completedPayments}`, 120, 215);
      doc.text(`Pending Payments: ${reportData.stats.pendingPayments}`, 120, 230);
      doc.text(`Conversion Rate: ${reportData.stats.conversionRate}%`, 120, 245);
      
      // Category Breakdown
      doc.fontSize(14).font("Helvetica-Bold").text("Category Breakdown", 100, 280);
      doc.fontSize(10).font("Helvetica");
      let categoryY = 305;
      reportData.categoryBreakdown.slice(0, 8).forEach((cat) => {
        doc.text(`${cat.name}: ${cat.events} events, ${cat.bookings} bookings, $${cat.revenue} revenue`, 120, categoryY);
        categoryY += 15;
      });
      
      doc.on("end", () => {
        console.log("[Download Report] PDF generation complete");
      });
      
      doc.on("error", (err) => {
        console.error("[Download Report] PDF generation error:", err);
      });
      
      doc.end();
    } else if (format === "txt") {
      console.log("[Download Report] Generating TXT...");
      const txt = generateTXTReport(reportData);
      console.log("[Download Report] TXT generated, size:", txt.length);
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="report-${new Date().getTime()}.txt"`
      );
      res.send(txt);
    } else {
      console.log("[Download Report] Invalid format:", format);
      res.status(400).json({ message: "Invalid format. Use 'pdf' or 'txt'" });
    }
  } catch (error) {
    console.error("[Reports API ERROR]", error);
    res.status(500).json({ message: error.message || "Failed to download report" });
  }
};

const downloadOrganizerReport = async (req, res) => {
  try {
    const { organizerId, format } = req.query;

    if (!organizerId) {
      return res.status(400).json({ message: "Organizer ID is required" });
    }

    if (!format) {
      return res
        .status(400)
        .json({ message: "format parameter is required (pdf or txt)" });
    }

    const reportData = await reportsService.generateReportData(organizerId);

    if (format === "pdf") {
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument();
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="organizer-report-${organizerId}-${new Date().getTime()}.pdf"`
      );

      doc.pipe(res);
      
      // Title
      doc.fontSize(20).font("Helvetica-Bold").text("Organizer Report", 100, 50);
      doc.fontSize(10).font("Helvetica").text(`Organizer ID: ${organizerId}`, 100, 80);
      doc.text(`Generated: ${reportData.reportGeneratedAt}`, 100, 95);
      
      // Statistics
      doc.fontSize(14).font("Helvetica-Bold").text("Statistics", 100, 130);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Total Events: ${reportData.stats.totalEvents}`, 120, 155);
      doc.text(`Total Revenue: $${reportData.stats.totalRevenue}`, 120, 170);
      
      doc.end();
    } else if (format === "txt") {
      const txt = generateTXTReport(reportData);
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="organizer-report-${organizerId}-${new Date().getTime()}.txt"`
      );
      res.send(txt);
    } else {
      res.status(400).json({ message: "Invalid format. Use 'pdf' or 'txt'" });
    }
  } catch (error) {
    console.error("[Reports API ERROR]", error);
    res.status(500).json({ message: error.message || "Failed to download organizer report" });
  }
};

const generateTXTReport = (reportData) => {
  let txt = "=" + "=".repeat(78) + "\n";
  txt += "EVENT REPORTS\n";
  txt += "=" + "=".repeat(78) + "\n\n";
  txt += `Generated: ${reportData.reportGeneratedAt}\n`;
  txt += `Period: ${reportData.reportPeriod}\n`;
  txt += `Organizer ID: ${reportData.organizerId}\n\n`;

  // Statistics Section
  txt += "-".repeat(80) + "\n";
  txt += "STATISTICS\n";
  txt += "-".repeat(80) + "\n";
  txt += `Total Events:           ${reportData.stats.totalEvents}\n`;
  txt += `Total Bookings:         ${reportData.stats.totalBookings}\n`;
  txt += `Total Revenue:          $${reportData.stats.totalRevenue}\n`;
  txt += `Total Payments:         ${reportData.stats.totalPayments}\n`;
  txt += `Completed Payments:     ${reportData.stats.completedPayments}\n`;
  txt += `Pending Payments:       ${reportData.stats.pendingPayments}\n`;
  txt += `Failed Payments:        ${reportData.stats.failedPayments}\n`;
  txt += `Upcoming Events:        ${reportData.stats.upcomingEvents}\n`;
  txt += `Ongoing Events:         ${reportData.stats.ongoingEvents}\n`;
  txt += `Completed Events:       ${reportData.stats.completedEvents}\n`;
  txt += `Cancelled Events:       ${reportData.stats.cancelledEvents}\n`;
  txt += `Paid Bookings:          ${reportData.stats.paidBookings}\n`;
  txt += `Pending Bookings:       ${reportData.stats.pendingBookings}\n`;
  txt += `Cancelled Bookings:     ${reportData.stats.cancelledBookings}\n`;
  txt += `Conversion Rate:        ${reportData.stats.conversionRate}%\n\n`;

  // Category Breakdown
  txt += "-".repeat(80) + "\n";
  txt += "CATEGORY BREAKDOWN\n";
  txt += "-".repeat(80) + "\n";
  txt += "Category              Events    Bookings   Revenue\n";
  txt += "-".repeat(80) + "\n";
  reportData.categoryBreakdown.forEach((cat) => {
    txt += `${cat.name.padEnd(20)} ${String(cat.events).padEnd(8)} ${String(cat.bookings).padEnd(10)} $${cat.revenue}\n`;
  });
  txt += "\n";

  // Top Events
  txt += "-".repeat(80) + "\n";
  txt += "TOP EVENTS (BY REVENUE)\n";
  txt += "-".repeat(80) + "\n";
  txt += "Event Name                    Category        Bookings   Revenue\n";
  txt += "-".repeat(80) + "\n";
  reportData.topEvents.forEach((event) => {
    txt += `${(event.name || "N/A").padEnd(28)} ${(event.category || "N/A").padEnd(15)} ${String(event.bookings).padEnd(10)} $${event.revenue}\n`;
  });
  txt += "\n";

  // Top Attendees
  txt += "-".repeat(80) + "\n";
  txt += "TOP ATTENDEES (BY BOOKINGS)\n";
  txt += "-".repeat(80) + "\n";
  txt += "Name                          Email                              Bookings\n";
  txt += "-".repeat(80) + "\n";
  reportData.topAttendees.forEach((attendee) => {
    txt += `${(attendee.name || "N/A").padEnd(29)} ${(attendee.email || "N/A").padEnd(34)} ${attendee.bookings}\n`;
  });
  txt += "\n";

  // Timeline Data
  txt += "-".repeat(80) + "\n";
  txt += "MONTHLY TIMELINE\n";
  txt += "-".repeat(80) + "\n";
  txt += "Month          Events    Bookings   Revenue    Cancelled\n";
  txt += "-".repeat(80) + "\n";
  reportData.timelineData.forEach((timeline) => {
    txt += `${timeline.month.padEnd(14)} ${String(timeline.events).padEnd(8)} ${String(timeline.bookings).padEnd(10)} $${String(timeline.revenue).padEnd(9)} ${timeline.cancelled}\n`;
  });
  txt += "\n";

  // Additional Metrics
  txt += "-".repeat(80) + "\n";
  txt += "ADDITIONAL METRICS\n";
  txt += "-".repeat(80) + "\n";
  txt += `Avg Bookings per Event:        ${reportData.additionalMetrics.avgBookingsPerEvent}\n`;
  txt += `Avg Revenue per Event:         $${reportData.additionalMetrics.avgRevenuePerEvent}\n`;
  txt += `Avg Revenue per Booking:       $${reportData.additionalMetrics.avgRevenuePerBooking}\n`;
  txt += `Cancellation Rate:             ${reportData.additionalMetrics.cancellationRate}%\n\n`;

  txt += "=" + "=".repeat(78) + "\n";
  txt += "END OF REPORT\n";
  txt += "=" + "=".repeat(78) + "\n";

  return txt;
};

const generateCSVReport = (reportData) => {
  let csv = "Event Reports\n";
  csv += `Generated: ${reportData.reportGeneratedAt}\n`;
  csv += `Period: ${reportData.reportPeriod}\n\n`;

  // Statistics Section
  csv += "STATISTICS\n";
  csv += "Metric,Value\n";
  csv += `Total Events,${reportData.stats.totalEvents}\n`;
  csv += `Total Bookings,${reportData.stats.totalBookings}\n`;
  csv += `Total Revenue,$${reportData.stats.totalRevenue}\n`;
  csv += `Total Payments,${reportData.stats.totalPayments}\n`;
  csv += `Completed Payments,${reportData.stats.completedPayments}\n`;
  csv += `Pending Payments,${reportData.stats.pendingPayments}\n`;
  csv += `Upcoming Events,${reportData.stats.upcomingEvents}\n`;
  csv += `Ongoing Events,${reportData.stats.ongoingEvents}\n`;
  csv += `Completed Events,${reportData.stats.completedEvents}\n`;
  csv += `Cancelled Events,${reportData.stats.cancelledEvents}\n`;
  csv += `Conversion Rate,${reportData.stats.conversionRate}%\n\n`;

  // Category Breakdown
  csv += "CATEGORY BREAKDOWN\n";
  csv += "Category,Events,Bookings,Revenue\n";
  reportData.categoryBreakdown.forEach((cat) => {
    csv += `${cat.name},${cat.events},${cat.bookings},$${cat.revenue}\n`;
  });
  csv += "\n";

  // Top Events
  csv += "TOP EVENTS\n";
  csv += "Event Name,Category,Status,Bookings,Revenue\n";
  reportData.topEvents.forEach((event) => {
    csv += `${event.name},${event.category},${event.status},${event.bookings},$${event.revenue}\n`;
  });
  csv += "\n";

  // Top Attendees
  csv += "TOP ATTENDEES\n";
  csv += "Name,Email,Bookings\n";
  reportData.topAttendees.forEach((attendee) => {
    csv += `${attendee.name},"${attendee.email}",${attendee.bookings}\n`;
  });
  csv += "\n";

  // Timeline Data
  csv += "MONTHLY TIMELINE\n";
  csv += "Month,Events,Bookings,Revenue,Cancelled\n";
  reportData.timelineData.forEach((timeline) => {
    csv += `${timeline.month},${timeline.events},${timeline.bookings},$${timeline.revenue},${timeline.cancelled}\n`;
  });
  csv += "\n";

  // Additional Metrics
  csv += "ADDITIONAL METRICS\n";
  csv += "Metric,Value\n";
  csv += `Avg Bookings per Event,${reportData.additionalMetrics.avgBookingsPerEvent}\n`;
  csv += `Avg Revenue per Event,$${reportData.additionalMetrics.avgRevenuePerEvent}\n`;
  csv += `Avg Revenue per Booking,$${reportData.additionalMetrics.avgRevenuePerBooking}\n`;
  csv += `Cancellation Rate,${reportData.additionalMetrics.cancellationRate}%\n`;

  return csv;
};

module.exports = {
  getReports,
  getOrganizerReports,
  getReportsByDateRange,
  downloadReport,
  downloadOrganizerReport,
};
