const User = require("../Model/User");

const getAllUsers = async () => {
  return await User.find({});
};

const getUserByEmail = async (userEmail) => {
  return await User.findOne({ email: userEmail });
};

const deleteUser = async (userEmail) => {
  return await User.deleteOne({ email: userEmail });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updatePassword = async (userEmail, newPassword) => {
  return await User.updateOne(
    { email: userEmail },
    { $set: { password: newPassword } },
  );
};

const updateProfileImage = async (userEmail, profileImage) => {
  return await User.updateOne(
    { email: userEmail },
    { $set: { profileImage: profileImage } },
  );
};

const updatePhone = async (userEmail, phone) => {
  return await User.updateOne({ email: userEmail }, { $set: { phone: phone } });
};

const updateStatus = async (userEmail, newStatus) => {
  return await User.updateOne(
    { email: userEmail },
    { $set: { status: newStatus } },
  );
};

const updateName = async (userEmail, firstName, lastName) => {
  const updateFields = {};
  if (firstName) updateFields.firstName = firstName;
  if (lastName) updateFields.lastName = lastName;
  return await User.updateOne({ email: userEmail }, { $set: updateFields });
};

const updateUsername = async (userEmail, newUserName) => {
  return await User.updateOne(
    { email: userEmail },
    { $set: { username: newUserName } },
  );
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updatePassword,
  updateProfileImage,
  updatePhone,
  updateStatus,
  updateName,
  updateUsername,
  getUserByEmail,
};
