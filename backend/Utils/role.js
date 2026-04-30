const ALLOWED_ROLES = ["admin", "user"];

function normalizeRole(role) {
  return String(role || "").toLowerCase() === "admin" ? "admin" : "user";
}

function sanitizeUserRole(user) {
  if (!user) {
    return user;
  }

  const plainUser =
    typeof user.toObject === "function" ? user.toObject() : { ...user };

  return {
    ...plainUser,
    role: normalizeRole(plainUser.role),
  };
}

function sanitizeUserRoles(users) {
  if (!Array.isArray(users)) {
    return [];
  }

  return users.map((user) => sanitizeUserRole(user));
}

module.exports = {
  ALLOWED_ROLES,
  normalizeRole,
  sanitizeUserRole,
  sanitizeUserRoles,
};