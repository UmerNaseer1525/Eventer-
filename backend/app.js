require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./Database/db");
const userRoute = require("./Routes/userRoutes");
const categoryRoute = require("./Routes/categoryRoutes");
const eventRoutes = require("./Routes/eventRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

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
    },
  });
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
