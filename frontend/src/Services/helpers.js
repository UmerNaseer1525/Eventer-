const DEFAULT_LOCAL_API_URL = "http://localhost:3000";

function normalizeBaseUrl(value) {
  if (!value) {
    return "";
  }

  return String(value).trim().replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  return import.meta.env.DEV ? DEFAULT_LOCAL_API_URL : "";
}

export function apiUrl(path = "") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return normalizedPath || "/";
  }

  return `${baseUrl}${normalizedPath}`;
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function getCurrentRole() {
  const user = getStoredUser();
  const role = user && (user.role || "");
  const normalized = String(role).toLowerCase();
  return normalized === "admin" ? "admin" : "user";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function createBookingPayload({ event, seatCount, values, totalPrice }) {
  const eventId = event && (event._id || event.id) ? (event._id || event.id) : "";
  const quantity = Number(seatCount || 1);
  return {
    event: eventId,
    ticketType: values && values.ticketType ? values.ticketType : "Regular",
    quantity,
    totalPrice: Number(totalPrice || 0),
    paymentStatus: String((values && values.paymentStatus) || "paid").toLowerCase(),
  };
}

export default {
  getApiBaseUrl,
  apiUrl,
  getStoredUser,
  getCurrentRole,
  getToken,
  isAuthenticated,
  createBookingPayload,
};
