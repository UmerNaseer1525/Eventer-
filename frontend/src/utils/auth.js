export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function getCurrentRole() {
  const user = getStoredUser();
  const role = String(user?.role || "").toLowerCase();
  return role === "admin" ? "admin" : "user";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}
