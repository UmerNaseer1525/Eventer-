export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getRecordDate(record) {
  const raw =
    record?.date ?? record?.createdAt ?? record?.updatedAt ?? record?.eventDate;
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isPaidPayment(payment) {
  const status = String(payment?.status ?? "").toLowerCase();
  return status === "completed" || status === "paid" || status === "success";
}

export function buildTimelineData({ period, events, bookings, payments }) {
  if (period === "weekly") {
    const today = new Date();
    const monday = new Date(today);
    const jsDay = monday.getDay();
    const diff = jsDay === 0 ? 6 : jsDay - 1;
    monday.setDate(monday.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const rows = WEEK_LABELS.map((label) => ({
      month: label,
      revenue: 0,
      bookings: 0,
      events: 0,
      cancelled: 0,
    }));

    payments.forEach((payment) => {
      const date = getRecordDate(payment);
      if (!date || date < monday) return;
      const idx = (date.getDay() + 6) % 7;
      rows[idx].revenue += toNumber(payment.amount);
    });

    bookings.forEach((booking) => {
      const date = getRecordDate(booking);
      if (!date || date < monday) return;
      const idx = (date.getDay() + 6) % 7;
      rows[idx].bookings += 1;
      if (String(booking.status ?? "").toLowerCase() === "cancelled") {
        rows[idx].cancelled += 1;
      }
    });

    events.forEach((event) => {
      const date = getRecordDate(event);
      if (!date || date < monday) return;
      const idx = (date.getDay() + 6) % 7;
      rows[idx].events += 1;
    });

    return rows;
  }

  const currentYear = new Date().getFullYear();
  const rows = MONTH_LABELS.map((label) => ({
    month: label,
    revenue: 0,
    bookings: 0,
    events: 0,
    cancelled: 0,
  }));

  payments.forEach((payment) => {
    const date = getRecordDate(payment);
    if (!date || date.getFullYear() !== currentYear) return;
    rows[date.getMonth()].revenue += toNumber(payment.amount);
  });

  bookings.forEach((booking) => {
    const date = getRecordDate(booking);
    if (!date || date.getFullYear() !== currentYear) return;
    const month = date.getMonth();
    rows[month].bookings += 1;
    if (String(booking.status ?? "").toLowerCase() === "cancelled") {
      rows[month].cancelled += 1;
    }
  });

  events.forEach((event) => {
    const date = getRecordDate(event);
    if (!date || date.getFullYear() !== currentYear) return;
    rows[date.getMonth()].events += 1;
  });

  return rows;
}
