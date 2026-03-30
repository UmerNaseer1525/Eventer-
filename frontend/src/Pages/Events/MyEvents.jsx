import {
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  StarOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Input,
  Tabs,
  Radio,
  Empty,
  Modal,
  notification,
  Badge,
  Popconfirm,
  Tooltip,
  Descriptions,
} from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteBooking } from "../../Services/bookingSlice";

const { Search } = Input;

// Status → Ant Design Tag color
const statusColor = {
  upcoming: "blue",
  ongoing: "green",
  completed: "default",
  cancelled: "red",
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function EventDetailModal({ event, open, onClose, type }) {
  if (!event) return null;
  const isCreated = type === "created";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <Button type="primary" onClick={onClose} block>
          Close
        </Button>
      }
      width={540}
      styles={{ body: { padding: 0 } }}
      centered
    >
      {/* Cover Image */}
      <div style={{ position: "relative" }}>
        <img
          src={event.cover}
          alt={event.name}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: "8px 8px 0 0",
            display: "block",
          }}
        />
        <Tag
          color="purple"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 6,
            padding: "2px 12px",
          }}
        >
          {event.category}
        </Tag>
        <Tag
          color={statusColor[event.status?.toLowerCase()] || "default"}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: 600,
            fontSize: 13,
            borderRadius: 6,
            padding: "2px 12px",
          }}
        >
          {event.status}
        </Tag>
      </div>

      {/* Details */}
      <div style={{ padding: "20px 24px 16px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 700 }}>
          {event.name}
        </h2>
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item
            label={
              <span>
                <EnvironmentOutlined /> Location
              </span>
            }
          >
            {event.location}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <PhoneOutlined /> Contact
              </span>
            }
          >
            {event.contact}
          </Descriptions.Item>
          {event.date && (
            <Descriptions.Item
              label={
                <span>
                  <CalendarOutlined /> Date
                </span>
              }
            >
              {event.date}
            </Descriptions.Item>
          )}
          {isCreated && event.attendees !== undefined && (
            <Descriptions.Item label="Attendees">
              {event.attendees}
            </Descriptions.Item>
          )}
          {isCreated && event.revenue !== undefined && (
            <Descriptions.Item label="Revenue">
              ${event.revenue.toLocaleString()}
            </Descriptions.Item>
          )}
          {!isCreated && event.ticketType && (
            <Descriptions.Item label="Ticket Type">
              <Tag color={event.ticketType === "VIP" ? "gold" : "blue"}>
                {event.ticketType}
              </Tag>
            </Descriptions.Item>
          )}
          {!isCreated && event.ticketPrice !== undefined && (
            <Descriptions.Item label="Amount Paid">
              ${event.ticketPrice}
            </Descriptions.Item>
          )}
          {!isCreated && event.organizer && (
            <Descriptions.Item label="Organizer">
              {event.organizer}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </Modal>
  );
}

// ─── Created Event Card ───────────────────────────────────────────────────────
function CreatedEventCard({ event, onView, onDelete }) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 12px #f0f1f2",
        width: "100%",
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
            }}
          />
          <Tag
            color="purple"
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 6,
              padding: "2px 12px",
            }}
          >
            {event.category}
          </Tag>
          <Tag
            color={statusColor[event.status?.toLowerCase()] || "default"}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 6,
              padding: "2px 12px",
            }}
          >
            {event.status}
          </Tag>
        </div>
      }
      actions={[
        <Tooltip title="View Details" key="view">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onView(event)}
            style={{ borderRadius: 6 }}
          >
            Detail
          </Button>
        </Tooltip>,
        <Popconfirm
          key="delete"
          title="Delete this event?"
          description="This action cannot be undone."
          onConfirm={() => onDelete(event)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <Button danger icon={<DeleteOutlined />} style={{ borderRadius: 6 }}>
            Delete
          </Button>
        </Popconfirm>,
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
        <span style={{ fontWeight: 700, fontSize: 16 }}>{event.name}</span>
      </div>
      <div style={{ marginBottom: 4, color: "#555", fontSize: 13 }}>
        <EnvironmentOutlined style={{ marginRight: 5 }} />
        {event.location}
      </div>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 8 }}>
        <PhoneOutlined style={{ marginRight: 5 }} />
        {event.contact}
      </div>

      {/* Mini stats */}
      <div
        style={{
          display: "flex",
          gap: 8,
          borderTop: "1px solid #f0f0f0",
          paddingTop: 10,
          marginTop: 4,
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#1677ff" }}>
            {event.attendees ?? "—"}
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>Attendees</div>
        </div>
        <div style={{ width: 1, background: "#f0f0f0" }} />
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#52c41a" }}>
            ${event.revenue ? event.revenue.toLocaleString() : "0"}
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>Revenue</div>
        </div>
      </div>
    </Card>
  );
}

// ─── Attending Event Card ─────────────────────────────────────────────────────
function AttendingEventCard({ event, onView, onCancel }) {
  const isCancelled = event.status?.toLowerCase() === "cancelled";
  const isCompleted = event.status?.toLowerCase() === "completed";

  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 12px #f0f1f2",
        width: "100%",
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
            }}
          />
          <Tag
            color="purple"
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 6,
              padding: "2px 12px",
            }}
          >
            {event.category}
          </Tag>
          <Tag
            color={statusColor[event.status?.toLowerCase()] || "default"}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 600,
              fontSize: 13,
              borderRadius: 6,
              padding: "2px 12px",
            }}
          >
            {event.status}
          </Tag>
        </div>
      }
      actions={[
        <Button
          key="view"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onView(event)}
          style={{ borderRadius: 6 }}
        >
          Detail
        </Button>,
        isCancelled || isCompleted ? (
          <Button key="cancel" disabled style={{ borderRadius: 6 }}>
            {isCancelled ? "Cancelled" : "Completed"}
          </Button>
        ) : (
          <Popconfirm
            key="cancel"
            title="Cancel this booking?"
            description="You will lose your spot at this event."
            onConfirm={() => onCancel(event)}
            okText="Yes, Cancel"
            okButtonProps={{ danger: true }}
            cancelText="No"
          >
            <Button
              danger
              icon={<CloseCircleOutlined />}
              style={{ borderRadius: 6 }}
            >
              Cancel
            </Button>
          </Popconfirm>
        ),
      ]}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 16 }}>{event.name}</span>
      </div>
      {event.organizer && (
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>
          by {event.organizer}
        </div>
      )}
      <div style={{ marginBottom: 4, color: "#555", fontSize: 13 }}>
        <EnvironmentOutlined style={{ marginRight: 5 }} />
        {event.location}
      </div>
      <div style={{ color: "#555", fontSize: 13, marginBottom: 8 }}>
        <PhoneOutlined style={{ marginRight: 5 }} />
        {event.contact}
      </div>

      {/* Ticket info */}
      <div
        style={{
          display: "flex",
          gap: 8,
          borderTop: "1px solid #f0f0f0",
          paddingTop: 10,
          marginTop: 4,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>
          <Tag
            color={event.ticketType === "VIP" ? "gold" : "blue"}
            style={{ fontWeight: 600, fontSize: 12 }}
          >
            {event.ticketType === "VIP"
              ? "⭐ VIP"
              : "🎟 " + (event.ticketType || "Standard")}
          </Tag>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
            Ticket Type
          </div>
        </div>
        <div
          style={{
            width: 1,
            background: "#f0f0f0",
            height: 36,
            alignSelf: "center",
          }}
        />
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#1677ff" }}>
            ${event.ticketPrice ?? "—"}
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>Paid</div>
        </div>
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function MyEvents() {
  const dispatch = useDispatch();

  // ── Redux selectors — adjust to match your store shape
  const allEvents = useSelector((state) => state.event);
  const bookings = useSelector((state) => state.booking);

  // ── Local state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailEvent, setDetailEvent] = useState(null);
  const [detailType, setDetailType] = useState(null);

  // ── Derived lists
  // "Created" = all events in eventSlice (adjust filter for auth if needed)
  const createdEvents = Array.isArray(allEvents)
    ? allEvents.filter(
        (e) =>
          e &&
          typeof e.name === "string" &&
          typeof e.status === "string" &&
          e.cover
      )
    : [];

  // "Attending" = events the user has booked (from bookingSlice)
  const attendingEvents = Array.isArray(bookings)
    ? bookings.filter(
        (e) => e && typeof e.name === "string" && e.cover
      )
    : [];

  // ── Filter helper
  const applyFilters = (list) =>
    list.filter((e) => {
      const matchName = e.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all"
          ? true
          : e.status?.toLowerCase() === statusFilter;
      return matchName && matchStatus;
    });

  const filteredCreated = applyFilters(createdEvents);
  const filteredAttending = applyFilters(attendingEvents);

  // ── Stats
  const upcomingCount = [...createdEvents, ...attendingEvents].filter(
    (e) => e.status?.toLowerCase() === "upcoming"
  ).length;

  const totalRevenue = createdEvents.reduce(
    (sum, e) => sum + (e.revenue || 0),
    0
  );

  // ── Handlers
  function handleDeleteCreated(event) {
    // dispatch(removeEvent(event.id)); // wire up your removeEvent action
    notification.success({
      message: "Event Deleted",
      description: `"${event.name}" has been deleted.`,
    });
  }

  function handleCancelAttending(event) {
    dispatch(deleteBooking(event.id));
    notification.warning({
      message: "Booking Cancelled",
      description: `Your booking for "${event.name}" has been cancelled.`,
    });
  }

  // ── Shared filter bar rendered inside each tab
  const FilterBar = (
    <Row gutter={[16, 12]} align="middle" style={{ marginBottom: 24 }}>
      <Col xs={24} md={8} lg={6}>
        <Search
          placeholder="Search events..."
          size="large"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: "100%" }}
        />
      </Col>
      <Col xs={24} md={16} lg={18}>
        <Radio.Group
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="large"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="upcoming">Upcoming</Radio.Button>
          <Radio.Button value="ongoing">Ongoing</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
          <Radio.Button value="cancelled">Cancelled</Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: "10px" }}>
      {/* ── Header */}
      <h1 style={{ marginBottom: 4 }}>My Events</h1>
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
        Manage events you've created and track events you're attending.
      </p>

      {/* ── Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 28 }}>
        {[
          {
            title: "Events Created",
            value: createdEvents.length,
            icon: <CalendarOutlined />,
            color: "#1677ff",
          },
          {
            title: "Events Attending",
            value: attendingEvents.length,
            icon: <StarOutlined />,
            color: "#faad14",
          },
          {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            icon: <TrophyOutlined />,
            color: "#52c41a",
          },
          {
            title: "Upcoming",
            value: upcomingCount,
            icon: <RiseOutlined />,
            color: "#722ed1",
          },
        ].map((s) => (
          <Col key={s.title} xs={12} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 12px #f0f1f2",
                borderTop: `3px solid ${s.color}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: s.color + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: s.color,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: s.color,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{s.title}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Tabs */}
      <Tabs
        defaultActiveKey="created"
        onChange={() => {
          setSearch("");
          setStatusFilter("all");
        }}
        size="large"
        type="card"
        items={[
          {
            key: "created",
            label: (
              <span>
                <CalendarOutlined />
                &nbsp;Events I Created&nbsp;
                <Badge
                  count={createdEvents.length}
                  showZero
                  style={{ backgroundColor: "#1677ff" }}
                />
              </span>
            ),
            children: (
              <div style={{ paddingTop: 16 }}>
                {FilterBar}
                <Row gutter={[24, 24]}>
                  {filteredCreated.length === 0 ? (
                    <Col span={24}>
                      <Empty description="No created events found." />
                    </Col>
                  ) : (
                    filteredCreated.map((event) => (
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
                        <CreatedEventCard
                          event={event}
                          onView={(e) => {
                            setDetailEvent(e);
                            setDetailType("created");
                          }}
                          onDelete={handleDeleteCreated}
                        />
                      </Col>
                    ))
                  )}
                </Row>
              </div>
            ),
          },
          {
            key: "attending",
            label: (
              <span>
                <StarOutlined />
                &nbsp;Events I'm Attending&nbsp;
                <Badge
                  count={attendingEvents.length}
                  showZero
                  style={{ backgroundColor: "#faad14" }}
                />
              </span>
            ),
            children: (
              <div style={{ paddingTop: 16 }}>
                {FilterBar}
                <Row gutter={[24, 24]}>
                  {filteredAttending.length === 0 ? (
                    <Col span={24}>
                      <Empty description="You haven't booked any events yet. Browse Manage Events to book one!" />
                    </Col>
                  ) : (
                    filteredAttending.map((event) => (
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
                        <AttendingEventCard
                          event={event}
                          onView={(e) => {
                            setDetailEvent(e);
                            setDetailType("attending");
                          }}
                          onCancel={handleCancelAttending}
                        />
                      </Col>
                    ))
                  )}
                </Row>
              </div>
            ),
          },
        ]}
      />

      {/* ── Detail Modal */}
      <EventDetailModal
        event={detailEvent}
        open={!!detailEvent}
        onClose={() => setDetailEvent(null)}
        type={detailType}
      />
    </div>
  );
}

export default MyEvents;