const User = require("../Model/User");

const getAllUsers = async () => {
  return await User.find({});
};

const getUserById = async (userId) => {
  return await User.findById(userId);
};

const deleteUser = async (userId) => {
  return await User.deleteOne({ _id: userId });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updatePassword = async (userId, newPassword) => {
  return await User.updateOne(
    { _id: userId },
    { $set: { password: newPassword } },
  );
};

const updateProfileImage = async (userId, profileImage) => {
  return await User.updateOne(
    { _id: userId },
    { $set: { profileImage: profileImage } },
  );
};

const updatePhone = async (userId, phone) => {
  return await User.updateOne({ _id: userId }, { $set: { phone: phone } });
};

const updateStatus = async (userId, newStatus) => {
  return await User.updateOne({ _id: userId }, { $set: { status: newStatus } });
};

const updateName = async (userId, firstName, lastName) => {
  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  return await User.updateOne({ _id: userId }, { $set: updateFields });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updatePassword,
  updateProfileImage,
  updatePhone,
  updateStatus,
  updateName,
};
