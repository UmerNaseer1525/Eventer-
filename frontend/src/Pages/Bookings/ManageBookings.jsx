import { Row, Col, Empty, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getAllBookings, deleteBookingAsync } from "../../Services/bookingSlice";
import { getAllEvents, updateEventCapacity } from "../../Services/eventSlice";
import BookingCard from "../../Components/BookingCard";
import BookingDetailModal from "../../Components/BookingDetailModal";

function ManageBookings() {
  const dispatch = useDispatch();
  const reduxBookings = useSelector((state) => state.booking);
  const events = useSelector((state) => state.event.eventsData);

  const visibleBookings = useMemo(() => {
    const bookings = Array.isArray(reduxBookings) ? reduxBookings : [];
    return bookings.filter((booking) => {
      const isConfirmedPayment =
        String(booking?.paymentStatus || "").toLowerCase() === "paid";
      const eventStatus = String(booking?.event?.status || "").toLowerCase();
      const isCompletedEvent = eventStatus === "completed";
      return isConfirmedPayment && booking && booking.event && !isCompletedEvent;
    });
  }, [reduxBookings]);

  console.log(reduxBookings)
  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getAllEvents());
  }, [dispatch]);

  async function handleCancelSeat(booking) {
    const eventRef = booking?.event;
    const eventId =
      eventRef?._id ||
      eventRef?.id ||
      (typeof eventRef === "string" ? eventRef : "") ||
      booking?.eventId ||
      booking?.event;
    const targetEventFromStore = Array.isArray(events)
      ? events.find((item) => String(item._id || item.id) === String(eventId))
      : null;
    const targetEvent =
      (eventRef && typeof eventRef === "object" ? eventRef : null) ||
      targetEventFromStore;

    if (!eventId) {
      notification.error({
        message: "Error",
        description: "Could not find event details.",
      });
      return;
    }

    const releasedSeats = Math.max(
      1,
      Number(booking.seatsReserved ?? booking.quantity ?? 1),
    );
    const currentCapacity = Math.max(
      0,
      Number(targetEvent?.capacity ?? 0),
    );
    const newCapacity = currentCapacity + releasedSeats;

    try {
      await dispatch(deleteBookingAsync(booking._id));
      await dispatch(updateEventCapacity(eventId, newCapacity));
      await dispatch(getAllEvents());

      notification.success({
        message: "Seat Cancelled",
        description: `Booking deleted for ${booking?.event?.title || "the event"} and seats released.`,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to cancel booking.",
      });
    }
  }

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "20px" }}>Bookings</h1>
      {visibleBookings.length === 0 ? (
        <Empty description="No confirmed bookings available." />
      ) : (
        <Row gutter={[24, 24]}>
          {visibleBookings.map((booking) => (
            <Col key={booking._id || booking.id} xs={24} sm={12} md={8} lg={6}>
              <BookingCard
                booking={booking}
                onDetail={setDetailItem}
                onCancelSeat={handleCancelSeat}
              />
            </Col>
          ))}
        </Row>
      )}

      <BookingDetailModal
        booking={detailItem}
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
      />
    </div>
  );
}

export default ManageBookings;
