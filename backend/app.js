require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./Database/db");
const userRoute = require("./Routes/userRoutes");
const eventRoutes = require("./Routes/eventRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const dashboardRoutes = require("./Routes/dashboardRoutes");
const analyticsRoutes = require("./Routes/analyticsRoutes");
const reportRoutes = require("./Routes/reportRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded images statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRoute);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "EventX Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      users: "/api/users",
      categories: "/api/categories",
      events: "/api/events",
      bookings: "/api/bookings",
      payments: "/api/payments",
      notifications: "/api/notifications",
      dashboard: "/api/dashboard",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "Failed to start server due to database connection error:",
      error,
    );
    process.exit(1);
  });

