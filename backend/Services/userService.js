const User = require("../Model/User");

const getAllUsers = async () => {
  return await User.find({});
};

// For login: include password
const getUserByEmail = async (userEmail) => {
  return await User.findOne({ email: userEmail });
};

// For returning user data to frontend: exclude password
const getUserByEmailWithoutPassword = async (userEmail) => {
  return await User.findOne({ email: userEmail }, "-password");
};

const deleteUser = async (userEmail) => {
  return await User.deleteOne({ email: userEmail });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updateUser = async (userEmail, values) => {
  const updateFields = {};
  const { firstName, lastName, username, password, phone, profileImage } =
    values;

  if (firstName !== undefined) updateFields.firstName = firstName;
  if (lastName !== undefined) updateFields.lastName = lastName;
  if (username !== undefined) updateFields.username = username;
  if (password !== undefined) updateFields.password = password;
  if (phone !== undefined) updateFields.phone = phone;
  if (profileImage !== undefined) updateFields.profileImage = profileImage;

  return await User.updateOne({ email: userEmail }, { $set: updateFields });
};

const updateStatus = async (email, newStatus) => {
  return await User.updateOne(
    { email: email },
    { $set: { status: newStatus } },
  );
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserByEmail,
  getUserByEmailWithoutPassword,
  updateStatus,
};
