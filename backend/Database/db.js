const mongoose = require("mongoose");
let connectPromise = null;
 
async function normalizeLegacyUserRoles() {
  const User = require("../Model/User");
  const result = await User.updateMany(
    {
      $or: [
        { role: { $exists: false } },
        { role: { $nin: ["admin", "user"] } },
      ],
    },
    { $set: { role: "user" } },
  );

  if (result.modifiedCount > 0) {
    console.log(`Normalized ${result.modifiedCount} legacy user role record(s).`);
  }
}

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB Connected successfully!");
    console.log("Using database:", mongoose.connection.name);
    await normalizeLegacyUserRoles();
    return mongoose.connection;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Error code:", error.code);
    if (error.cause) {
      console.error("Cause:", error.cause);
    }
    connectPromise = null;
    throw error;
  }
  })();

  return connectPromise;
};

const closeDB = async () => {
  await mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
