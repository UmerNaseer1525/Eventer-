const userServices = require("../Services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userServices.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Don't send password in response
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login Successfully",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Creating user with email:", email);
    const result = await userServices.getUserByEmail(email);
    if (result) {
      console.log("User already exists with email:", email);
      return res
        .status(409)
        .json({ message: "User already Exist with this email" });
    }

    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      ...req.body,
      password: hashedPassword,
    };

    const user = await userServices.createUser(userData);
    console.log("User created successfully:", user._id);
    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await userServices.deleteUser(email);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { email } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const result = await userServices.updatePassword(email, password);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    const { email } = req.params;
    const { profileImage } = req.body;
    if (!profileImage) {
      return res.status(400).json({ message: "Profile image URL is required" });
    }
    const result = await userServices.updateProfileImage(email, profileImage);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile image updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePhone = async (req, res) => {
  try {
    const { email } = req.params;
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const result = await userServices.updatePhone(email, phone);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Phone updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    if (!["active", "blocked"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'active' or 'blocked'" });
    }
    const result = await userServices.updateStatus(email, status);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateName = async (req, res) => {
  try {
    const { email } = req.params;
    const { firstName, lastName } = req.body;
    if (!firstName && !lastName) {
      return res.status(400).json({
        message: "At least one name field (firstName or lastName) is required",
      });
    }
    const result = await userServices.updateName(email, firstName, lastName);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Name updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUsername = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }

  try {
    const result = await userServices.updateUsername(username);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updatePassword,
  updateProfileImage,
  updatePhone,
  updateStatus,
  updateName,
  updateUsername,
  getUserByEmail,
  loginUser,
};
