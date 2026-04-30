const userServices = require("../Services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const normalizeRole = (role) =>
  String(role || "").toLowerCase() === "admin" ? "admin" : "user";

const sanitizeUserRole = (user) => {
  if (!user) {
    return user;
  }

  const plainUser =
    typeof user.toObject === "function" ? user.toObject() : { ...user };

  return {
    ...plainUser,
    role: normalizeRole(plainUser.role),
  };
};

const sanitizeUserRoles = (users) =>
  Array.isArray(users) ? users.map((user) => sanitizeUserRole(user)) : [];

const getUsers = async (req, res) => {
  try {
    const users = await userServices.getAllUsers();
    res.status(200).json(sanitizeUserRoles(users));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userServices.getUserByEmailWithoutPassword(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(sanitizeUserRole(user));
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

    if (!user.password) {
      return res
        .status(400)
        .json({ message: "password filed is missing in backend" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password. Please try again." });
    }

    const role = normalizeRole(user.role);

    const token = jwt.sign(
      { id: user._id, email: user.email, role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login Successfully",
      token: token,
      user: sanitizeUserRole({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userServices.getUserByEmail(email);
    if (result) {
      return res
        .status(409)
        .json({ message: "User already Exist with this email" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let profileImagePath = req.body.profileImage;
    if (req.file) {
      profileImagePath = `/uploads/${req.file.filename}`;
    }

    const userData = {
      ...req.body,
      role: "user",
      password: hashedPassword,
      profileImage: profileImagePath,
    };

    const user = await userServices.createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
      profileImage: user.profileImage,
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

const updateStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const status = req.query.status;
    if (!status) {
      return res
        .status(400)
        .json({ message: "Missing status query parameter" });
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

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const allowedFields = [
      "firstName",
      "lastName",
      "username",
      "password",
      "phone",
      "profileImage",
      "status",
    ];

    const user = await userServices.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};
    for (const field of allowedFields) {
      if (field === "profileImage") {
        if (req.file) {
          updateData.profileImage = `/uploads/${req.file.filename}`;
        } else if (
          Object.prototype.hasOwnProperty.call(req.body, "profileImage") &&
          req.body.profileImage
        ) {
          updateData.profileImage = req.body.profileImage;
        } else {
          updateData.profileImage = user.profileImage;
        }
        continue;
      }

      const hasField = Object.prototype.hasOwnProperty.call(req.body, field);
      const incomingValue = hasField ? req.body[field] : undefined;
      const isEmptyString =
        typeof incomingValue === "string" && incomingValue.trim() === "";
      const useOldValue =
        !hasField ||
        incomingValue === undefined ||
        incomingValue === null ||
        isEmptyString;

      if (field === "password") {
        if (hasField && incomingValue !== undefined && incomingValue !== null) {
          if (typeof incomingValue !== "string") {
            return res
              .status(400)
              .json({ message: "Password must be a string" });
          }
        }

        if (useOldValue) {
          updateData.password = user.password;
        } else {
          const saltRounds = 10;
          updateData.password = await bcrypt.hash(incomingValue, saltRounds);
        }

        continue;
      }

      updateData[field] = useOldValue ? user[field] : incomingValue;
    }

    if (
      updateData.status !== undefined &&
      !["active", "blocked"].includes(updateData.status)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'active' or 'blocked'" });
    }

    const result = await userServices.updateUser(email, updateData);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = sanitizeUserRole(
      await userServices.getUserByEmailWithoutPassword(email),
    );
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserByEmail,
  loginUser,
  updateStatus,
};
