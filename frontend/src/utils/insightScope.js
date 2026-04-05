import { isPaidPayment, toNumber } from "../Components/Insights/insightUtils";
import { isEventApproved } from "./eventApproval";

function keyOf(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function buildApprovedEventLookup(events) {
  const ids = new Set();
  const names = new Set();

  events.forEach((event) => {
    const idKey = keyOf(event?.id);
    const titleKey = keyOf(event?.title ?? event?.name);
    if (idKey) ids.add(idKey);
    if (titleKey) names.add(titleKey);
  });

  return { ids, names };
}

function belongsToApprovedEvent(record, lookup) {
  const eventIdKey = keyOf(record?.eventId);
  const recordIdKey = keyOf(record?.id);
  const titleKey = keyOf(record?.title ?? record?.name ?? record?.eventName);

  if (eventIdKey && lookup.ids.has(eventIdKey)) return true;
  if (recordIdKey && lookup.ids.has(recordIdKey)) return true;
  if (titleKey && lookup.names.has(titleKey)) return true;

  return false;
}

export function getApprovedEvents(events) {
  const safeEvents = Array.isArray(events) ? events : [];
  return safeEvents.filter((event) => event && isEventApproved(event));
}

export function getPaidApprovedBookings(bookings, approvedEvents) {
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const lookup = buildApprovedEventLookup(approvedEvents);

  return safeBookings.filter((booking) => {
    const isPaid = keyOf(booking?.paymentStatus) === "paid";
    return isPaid && belongsToApprovedEvent(booking, lookup);
  });
}

export function getCompletedApprovedPayments(payments, approvedEvents) {
  const safePayments = Array.isArray(payments) ? payments : [];
  const lookup = buildApprovedEventLookup(approvedEvents);

  return safePayments.filter(
    (payment) =>
      isPaidPayment(payment) && belongsToApprovedEvent(payment, lookup),
  );
}

export function getTotalRevenue(completedPayments, paidBookings) {
  const paymentRevenue = completedPayments.reduce(
    (sum, item) => sum + toNumber(item?.amount),
    0,
  );

  if (paymentRevenue > 0) return paymentRevenue;

  return paidBookings.reduce(
    (sum, item) => sum + toNumber(item?.amount ?? item?.price),
    0,
  );
}
