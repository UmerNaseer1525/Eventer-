export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (e) {
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
  getStoredUser,
  getCurrentRole,
  getToken,
  isAuthenticated,
  createBookingPayload,
};
