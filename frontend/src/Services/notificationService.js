const NOTIFICATIONS_URL = "http://localhost:3000/api/notifications";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function formatRelativeTime(value) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return "Yesterday";
  }

  return `${diffDays} days ago`;
}

function normalizeNotification(notification) {
  return {
    id: notification._id || notification.id,
    type: notification.type || "info",
    title: notification.title || "Notification",
    message: notification.message || "",
    time: formatRelativeTime(notification.createdAt),
    read: Boolean(notification.read),
    category: notification.category || "System",
    target: notification.target || "user",
    recipient: notification.recipient || null,
  };
}

async function fetchNotifications(params = {}) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const url = new URL(NOTIFICATIONS_URL);
  if (params.target) {
    url.pathname = `${url.pathname}/target/${encodeURIComponent(params.target)}`;
  } else if (params.recipientId) {
    url.pathname = `${url.pathname}/recipient/${encodeURIComponent(params.recipientId)}`;
    if (params.unreadOnly) {
      url.pathname += "/unread";
    }
  }

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Unable to fetch notifications");
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeNotification) : [];
}

async function markNotificationAsRead(notificationId) {
  const response = await fetch(`${NOTIFICATIONS_URL}/${notificationId}/read`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Unable to update notification");
  }
}

async function deleteNotification(notificationId) {
  const response = await fetch(`${NOTIFICATIONS_URL}/${notificationId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Unable to delete notification");
  }
}

async function markAllNotificationsAsRead(recipientId) {
  const response = await fetch(
    `${NOTIFICATIONS_URL}/recipient/${encodeURIComponent(recipientId)}/read-all`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Unable to update notifications");
  }
}

export {
  fetchNotifications,
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  normalizeNotification,
};