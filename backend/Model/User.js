const mongoose = require("mongoose");
const { normalizeRole } = require("../Utils/role");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
    default: "user",
    set: normalizeRole,
  },

  phone: {
    type: String,
    required: false,
  },

  profileImage: {
    type: String,
    required: false,
  },

  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
