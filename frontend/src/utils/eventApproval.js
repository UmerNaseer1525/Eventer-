function toLower(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function normalizeApprovalStatus(event) {
  const rawStatus = toLower(event?.approvedStatus);

  if (rawStatus === "accepted" || rawStatus === "approved") {
    return "Accepted";
  }

  if (rawStatus === "pending") {
    return "Pending";
  }

  if (rawStatus === "rejected") {
    return "Rejected";
  }

  if (typeof event?.isApproved === "boolean") {
    return event.isApproved ? "Accepted" : "Pending";
  }

  return "Accepted";
}

export function isEventApproved(event) {
  return normalizeApprovalStatus(event) === "Accepted";
}

export function isEventPending(event) {
  return normalizeApprovalStatus(event) === "Pending";
}

export function isEventRejected(event) {
  return normalizeApprovalStatus(event) === "Rejected";
}

export function isEventInApprovalQueue(event) {
  const status = normalizeApprovalStatus(event);
  return status === "Pending" || status === "Rejected";
}
