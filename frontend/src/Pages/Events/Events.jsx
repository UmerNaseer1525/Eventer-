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
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addBooking } from "../../Services/bookingSlice";

function Events() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const events = useSelector((state) => state.event);
  console.log(events);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function onSearchFilter(e) {
    setSearch(e.target.value);
  }

  function onStatusFilter(e) {
    setStatus(e.target.value);
  }

  function handleBookings(event_Detail) {
    if (!event_Detail || !event_Detail.id) {
      setError({
        message: "Invalid event data. Cannot add booking.",
        detail: event_Detail,
      });
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      dispatch(addBooking(event_Detail));
      setIsLoading(false);
      notification.success({
        message: "Booking Successful",
        description: `Successfully booked ${event_Detail.name}`,
      });
    }, 1000);
  }

  const validEvents = Array.isArray(events)
    ? events.filter(
        (event) =>
          event &&
          typeof event.name === "string" &&
          typeof event.status === "string" &&
          typeof event.location === "string" &&
          typeof event.contact === "string" &&
          typeof event.category === "string" &&
          event.cover,
      )
    : [];

  const filteredEvents = validEvents
    .filter((event) => event.status.toLowerCase() !== "completed")
    .filter((event) => {
      const matchesName = event.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ? true : event.status.toLowerCase() === status;
      return (
        matchesName &&
        matchesStatus &&
        event.status.toLowerCase() !== "cancelled"
      );
    });

  const cancelledEvents = validEvents
    .filter((event) => event.status.toLowerCase() === "cancelled")
    .filter((event) => {
      const matchesName = event.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ? true : event.status.toLowerCase() === status;
      return matchesName && matchesStatus;
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
            <Radio.Button value={"all"}>All</Radio.Button>
            <Radio.Button value={"upcoming"}>Upcoming</Radio.Button>
            <Radio.Button value={"completed"}>Completed</Radio.Button>
            <Radio.Button value={"ongoing"}>Ongoing</Radio.Button>
            <Radio.Button value={"cancelled"}>Cancelled</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      {/* Cancelled Events Alert */}
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
                          alt={event.name}
                          src={event.cover}
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
                        {event.name}
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
                      <b>Contact:</b> {event.contact}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
      <Divider />
      {/* Normal Events */}
      <Row gutter={[24, 24]}>
        {filteredEvents.length === 0 ? (
          <Col span={24}>
            <Empty description="No events found or invalid event data." />
          </Col>
        ) : (
          filteredEvents.map((event) => {
            let bookingDisabled = false;
            let bookingLabel = "Bookings";
            if (
              event.status.toLowerCase() === "completed" ||
              event.status.toLowerCase() === "cancelled"
            ) {
              bookingDisabled = true;
              bookingLabel = "Not Available";
            } else if (event.status.toLowerCase() === "ongoing") {
              bookingDisabled = true;
              bookingLabel = "Contact Management";
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
                        alt={event.name}
                        src={event.cover}
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
                      style={{ borderRadius: 6 }}
                    >
                      Detail
                    </Button>,
                    <Button
                      key="bookings"
                      loading={isLoading}
                      style={{ borderRadius: 6 }}
                      onClick={() => handleBookings(event)}
                      disabled={bookingDisabled}
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
                      {event.name}
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
                    <b>Contact:</b> {event.contact}
                  </div>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
}

export default Events;
