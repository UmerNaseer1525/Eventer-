import { Row, Col, Empty, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import { updateBooking } from "../../Services/bookingSlice";
import { updateEvent } from "../../Services/eventSlice";
import BookingCard from "../../Components/BookingCard";
import BookingDetailModal from "../../Components/BookingDetailModal";

function ManageBookings() {
  const dispatch = useDispatch();
  const reduxBookings = useSelector((state) => state.booking);
  const events = useSelector((state) => state.event);

  const visibleBookings = useMemo(() => {
    const bookings = Array.isArray(reduxBookings) ? reduxBookings : [];
    return bookings.filter((booking) => {
      const isConfirmedPayment = booking?.paymentStatus === "Paid";
      return isConfirmedPayment && booking && booking.name && booking.cover;
    });
  }, [reduxBookings]);

  const [detailItem, setDetailItem] = useState(null);

  function releaseSeatsToEvent(booking) {
    const eventId = booking.eventId ?? booking.id;
    const event = Array.isArray(events)
      ? events.find((item) => String(item.id) === String(eventId))
      : null;

    if (!event) return;

    const releasedSeats = Math.max(
      1,
      Number(booking.reservedSeats ?? booking.number_of_guests ?? 1),
    );
    const currentSeats = Math.max(
      0,
      Number(
        event.remainingSeats ?? event.number_of_guests ?? event.capacity ?? 0,
      ),
    );
    const capacity = Math.max(
      currentSeats,
      Number(event.capacity ?? currentSeats),
    );
    const nextSeats = Math.min(capacity, currentSeats + releasedSeats);

    dispatch(
      updateEvent({
        ...event,
        remainingSeats: nextSeats,
        number_of_guests: nextSeats,
      }),
    );
  }

  function handleCancelSeat(booking) {
    dispatch(
      updateBooking({
        ...booking,
        status: "Cancelled",
        paymentStatus:
          booking.paymentStatus === "Paid" ? "Refunded" : booking.paymentStatus,
      }),
    );

    releaseSeatsToEvent(booking);

    notification.success({
      message: "Seat Cancelled",
      description: `Seat released for ${booking.name} and is now available to others.`,
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
