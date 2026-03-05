const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected successfully!");
    console.log("Using database:", mongoose.connection.name);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Error code:", error.code);
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
