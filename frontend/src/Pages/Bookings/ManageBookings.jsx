import { Row, Col, Empty, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getAllBookings, deleteBookingAsync } from "../../Services/bookingSlice";
import { updateEventAsync } from "../../Services/eventSlice";
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
      return isConfirmedPayment && booking && booking.event;
    });
  }, [reduxBookings]);

  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  function releaseSeatsToEvent(booking) {
    const event = booking?.event;
    const eventId = event?._id || event?.id || booking.eventId || booking.event;
    const targetEvent = Array.isArray(events)
      ? events.find((item) => String(item._id || item.id) === String(eventId))
      : null;

    if (!targetEvent) return;

    const releasedSeats = Math.max(
      1,
      Number(booking.quantity ?? booking.reservedSeats ?? booking.number_of_guests ?? 1),
    );
    const currentSeats = Math.max(
      0,
      Number(
        targetEvent.remainingSeats ?? targetEvent.number_of_guests ?? targetEvent.capacity ?? 0,
      ),
    );
    const capacity = Math.max(
      currentSeats,
      Number(targetEvent.capacity ?? currentSeats),
    );
    const nextSeats = Math.min(capacity, currentSeats + releasedSeats);

    dispatch(
      updateEventAsync({
        ...targetEvent,
        _id: targetEvent._id || targetEvent.id,
        remainingSeats: nextSeats,
        number_of_guests: nextSeats,
      }),
    );
  }

  function handleCancelSeat(booking) {
    dispatch(deleteBookingAsync(booking._id || booking.id));
    releaseSeatsToEvent(booking);

    notification.success({
      message: "Seat Cancelled",
      description: `Booking deleted for ${booking.event.title} and seats released.`,
    });
  }

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "20px" }}>Bookings</h1>
      {visibleBookings.length === 0 ? (
        <Empty description="No confirmed bookings available." />
      ) : (
        <Row gutter={[24, 24]}>
          {visibleBookings.map((booking) => (
            <Col key={booking.id} xs={24} sm={12} md={8} lg={6}>
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
