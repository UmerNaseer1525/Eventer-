import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Input,
  Radio,
  Empty,
  Alert,
  notification,
  Divider,
} from "antd";
import {  useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBookingAsync } from "../../Services/bookingSlice";
import { addPayment } from "../../Services/paymentSlice";
import { getAllEvents, updateEvent } from "../../Services/eventSlice";
import Event_Detail from "../../Components/Event_Detail";
import EventBookingPaymentModal from "../../Components/EventBookingPaymentModal";
import { useEffect } from "react";

function Events() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const events = useSelector((state) => state.event.eventsData);
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  function onSearchFilter(e) {
    setSearch(e.target.value);
  }

  function onStatusFilter(e) {
    setStatus(e.target.value);
  }

  function openBookingModal(event) {
    if (!event || !event.id) {
      setError({
        message: "Invalid event data. Cannot start booking.",
        detail: event,
      });
      return;
    }

    setError(null);
    setBookingEvent(event);
    setIsBookingModalOpen(true);
  }

  function handleConfirmBooking(values) {
    if (!bookingEvent) return;

    const seatsLeft = Math.max(
      0,
      Number(
        bookingEvent.remainingSeats ??
          bookingEvent.number_of_guests ??
          bookingEvent.capacity ??
          0,
      ),
    );

    if (values.seatCount > seatsLeft) {
      notification.error({
        message: "Not enough seats",
        description: "Please choose fewer seats.",
      });
      return;
    }

    const seatCount = Number(values.seatCount || 1);
    const totalAmount = seatCount * Number(bookingEvent.ticketPrice ?? 0);
    const remainingSeats = Math.max(0, seatsLeft - seatCount);
    const today = new Date().toISOString().split("T")[0];
    const stamp = Date.now();

    setIsBookingSubmitting(true);
    setTimeout(() => {
      dispatch(
        addBookingAsync({
          id: `BK-${stamp}`,
          eventId: bookingEvent.id,
          title: bookingEvent.title,
          name: bookingEvent.title,
          category: bookingEvent.category,
          location: bookingEvent.location,
          organizer:
            typeof bookingEvent.organizer === "object"
              ? [bookingEvent.organizer.firstName, bookingEvent.organizer.lastName]
                  .filter(Boolean)
                  .join(" ") || bookingEvent.organizer.email || "EventX"
              : bookingEvent.organizer || "EventX",
          contact: bookingEvent.contact || "-",
          status: bookingEvent.status === "Ongoing" ? "Ongoing" : "Upcoming",
          paymentStatus: "paid",
          amount: totalAmount,
          price: totalAmount,
          date: bookingEvent.date || today,
          time: bookingEvent.time || "-",
          cover: bookingEvent.bannerImage || bookingEvent.cover,
          bannerImage: bookingEvent.bannerImage || bookingEvent.cover,
          quantity: seatCount,
          number_of_guests: seatCount,
          reservedSeats: seatCount,
          user: values.fullName,
          email: values.email,
          method: values.paymentMethod,
          ticketType: "Regular",
        }),
      );

      dispatch(
        addPayment({
          id: `PAY-${stamp}`,
          eventId: bookingEvent.id,
          eventName: bookingEvent.title,
          user: values.fullName,
          email: values.email,
          amount: totalAmount,
          method: values.paymentMethod,
          status: "Completed",
          date: today,
        }),
      );

      dispatch(
        updateEvent({
          ...bookingEvent,
          remainingSeats,
          number_of_guests: remainingSeats,
        }),
      );

      notification.success({
        message: "Seat Reserved",
        description: `${seatCount} seat(s) reserved for ${bookingEvent.title}.`,
      });

      setIsBookingSubmitting(false);
      setIsBookingModalOpen(false);
      setBookingEvent(null);
    }, 1200);
  }

  const validEvents = Array.isArray(events)
    ? events
        .map((event) => ({
          ...event,
          id: event?.id || event?._id,
        }))
        .filter(
          (event) =>
            event &&
            event.id &&
            typeof event.title === "string" &&
            typeof event.status === "string" &&
            typeof event.location === "string" &&
            typeof event.category === "string" &&
            event.bannerImage,
        )
    : [];

  const filteredEvents = validEvents
    .filter((event) => event.status.toLowerCase() !== "completed")
    .filter((event) => {
      const matchesTitle = event.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ? true : event.status.toLowerCase() === status;
      return (
        matchesTitle &&
        matchesStatus &&
        event.status.toLowerCase() !== "cancelled"
      );
    });

  const cancelledEvents = validEvents
    .filter((event) => event.status.toLowerCase() === "cancelled")
    .filter((event) => {
      const matchesTitle = event.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ? true : event.status.toLowerCase() === status;
      return matchesTitle && matchesStatus;
    });

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "20px" }}>Manage Events</h1>
      {error && (
        <Alert
          title="Error"
          description={
            <div>
              {error.message}
              <pre style={{ fontSize: 12, marginTop: 8 }}>
                {JSON.stringify(error.detail, null, 2)}
              </pre>
            </div>
          }
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
        <Col xs={24} md={8} lg={6}>
          <Input
            placeholder="Search events..."
            size="large"
            value={search}
            onChange={onSearchFilter}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} md={16} lg={18}>
          <Radio.Group
            value={status}
            onChange={onStatusFilter}
            size="large"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              width: "100%",
            }}
          >
            <Radio.Button value={"all"}>All </Radio.Button>
            <Radio.Button value={"upcoming"}>Upcoming</Radio.Button>
            <Radio.Button value={"completed"}>Completed</Radio.Button>
            <Radio.Button value={"ongoing"}>Ongoing</Radio.Button>
            <Radio.Button value={"cancelled"}>Cancelled</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      {cancelledEvents.length > 0 && (
        <>
          <Alert
            message={<span>Below are cancelled events</span>}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <div style={{ marginBottom: 32 }}>
            <Row gutter={[24, 24]}>
              {cancelledEvents.map((event) => (
                <Col
                  key={event.id}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={8}
                  xxl={6}
                  style={{ display: "flex" }}
                >
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      boxShadow: "0 2px 12px #f0f1f2",
                      width: "100%",
                      minWidth: 0,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      background: "#fff0f0",
                    }}
                    cover={
                      <div style={{ position: "relative" }}>
                        <img
                          alt={event.title}
                          src={event.bannerImage}
                          style={{
                            height: "clamp(140px, 18vw, 180px)",
                            objectFit: "cover",
                            width: "100%",
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            transition: "height 0.2s",
                          }}
                        />
                        <Tag
                          color="red"
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: 600,
                            fontSize: 14,
                            borderRadius: 6,
                            padding: "2px 12px",
                          }}
                        >
                          {event.category}
                        </Tag>
                      </div>
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: 18 }}>
                        {event.title}
                      </span>
                      <Tag
                        color="red"
                        style={{
                          fontWeight: 500,
                          fontSize: 13,
                          borderRadius: 6,
                        }}
                      >
                        Cancelled
                      </Tag>
                    </div>
                    <div style={{ marginBottom: 4, color: "#555" }}>
                      <b>Location:</b> {event.location}
                    </div>
                    <div style={{ color: "#555" }}>
                      <b>Organized By:</b> {event?.organizer?.firstName} {event?.organizer?.lastName}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
      <Divider />
      <Row gutter={[24, 24]}>
        {filteredEvents.length === 0 ? (
          <Col span={24}>
            <Empty description="No events found or invalid event data." />
          </Col>
        ) : (
          filteredEvents.map((event) => {
            let bookingDisabled = false;
            let bookingLabel = "Book Now";
            const seatsLeft = Math.max(
              0,
              Number(
                event.remainingSeats ??
                  event.number_of_guests ??
                  event.capacity ??
                  0,
              ),
            );
            if (
              event.status.toLowerCase() === "completed" ||
              event.status.toLowerCase() === "cancelled"
            ) {
              bookingDisabled = true;
              bookingLabel = "Not Available";
            } else if (event.status.toLowerCase() === "ongoing") {
              bookingDisabled = true;
              bookingLabel = "Contact Management";
            } else if (seatsLeft <= 0) {
              bookingDisabled = true;
              bookingLabel = "Sold Out";
            }
            return (
              <Col
                key={event.id}
                xs={24}
                sm={12}
                md={12}
                lg={12}
                xl={8}
                xxl={6}
                style={{ display: "flex" }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 12px #f0f1f2",
                    width: "100%",
                    minWidth: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  cover={
                    <div style={{ position: "relative" }}>
                      <img
                        alt={event.title}
                        src={event.bannerImage}
                        style={{
                          height: "clamp(140px, 18vw, 180px)",
                          objectFit: "cover",
                          width: "100%",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          transition: "height 0.2s",
                        }}
                      />
                      <Tag
                        color="purple"
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          fontWeight: 600,
                          fontSize: 14,
                          borderRadius: 6,
                          padding: "2px 12px",
                        }}
                      >
                        {event.category}
                      </Tag>
                    </div>
                  }
                  actions={[
                    <Button
                      type="primary"
                      key="detail"
                      style={{ borderRadius: 6, width: "90%" }}
                      size="medium"
                      onClick={() => {
                        setIsDetailDrawerOpen(true);
                        setSelectedEvent(event);
                      }}
                    >
                      Detail
                    </Button>,
                    <Button
                      key="bookings"
                      loading={
                        isBookingSubmitting && bookingEvent?.id === event.id
                      }
                      style={{ borderRadius: 6, width: "90%" }}
                      disabled={bookingDisabled}
                      size="medium"
                      onClick={() => {
                        openBookingModal(event);
                      }}
                    >
                      {bookingLabel}
                    </Button>,
                  ]}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 18 }}>
                      {event.title}
                    </span>
                    <Tag
                      color={
                        event.status === "Upcoming"
                          ? "blue"
                          : event.status === "Ongoing"
                            ? "green"
                            : event.status === "Cancelled"
                              ? "red"
                              : "gray"
                      }
                      style={{ fontWeight: 500, fontSize: 13, borderRadius: 6 }}
                    >
                      {event.status}
                    </Tag>
                  </div>
                  <div style={{ marginBottom: 4, color: "#555" }}>
                    <b>Location:</b> {event.location}
                  </div>
                  <div style={{ color: "#555" }}>
                    <b>Organized By:</b> {event?.organizer?.firstName} {event?.organizer?.lastName}
                  </div>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
      <Event_Detail
        event={selectedEvent}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onBook={() => {
          setIsDetailDrawerOpen(false);
          openBookingModal(selectedEvent);
        }}
      />
      <EventBookingPaymentModal
        event={bookingEvent}
        open={isBookingModalOpen}
        loading={isBookingSubmitting}
        onClose={() => {
          if (isBookingSubmitting) return;
          setIsBookingModalOpen(false);
          setBookingEvent(null);
        }}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}

export default Events;
