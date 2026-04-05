export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function normalizeRole(role) {
  return String(role || "").toLowerCase() === "admin" ? "admin" : "user";
}

export function getCurrentRole() {
  const user = getStoredUser();
  return normalizeRole(user?.role);
}

export function isBlockedUser(user) {
  return String(user?.status || "").toLowerCase() === "blocked";
}
