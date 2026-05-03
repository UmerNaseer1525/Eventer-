import {
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Input,
  Radio,
  Empty,
  notification,
  Popconfirm,
  Select,
} from "antd";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteEventAsync, getAllEvents, updateEventStatusAsync } from "../../Services/eventSlice";
import Event_Detail from "../../Components/Event_Detail";
import { useEffect } from "react";

function AdminEvents() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const eventsData = useSelector((state) => state.event.eventsData);
  const dispatch = useDispatch();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  function onSearchFilter(e) {
    setSearch(e.target.value);
  }

  function onStatusFilter(e) {
    setStatus(e.target.value);
  }

  function onCategoryFilter(e) {
    setCategory(e);
  }

  function handleStatusChange(eventId, value) {
    setLoadingId(eventId);
    dispatch(updateEventStatusAsync({ id: eventId, status: value }))
      .then(() => {
        notification.success({
          message: "Status Updated",
          description: `Event status changed to ${value}.`,
        });
        setLoadingId(null);
      })
      .catch(() => {
        notification.error({
          message: "Update Failed",
          description: "Could not update event status.",
        });
        setLoadingId(null);
      });
  }

  function handleDeleteEvent(eventId) {
    setLoadingId(eventId);
    dispatch(deleteEventAsync(eventId))
      .then(() => {
        notification.success({
          message: "Event Deleted",
          description: "Event has been successfully deleted.",
        });
        dispatch(getAllEvents());
        setLoadingId(null);
      })
      .catch(() => {
        notification.error({
          message: "Delete Failed",
          description: "Could not delete event.",
        });
        setLoadingId(null);
      });
  }

  const validEvents = Array.isArray(eventsData)
    ? eventsData.map((event) => ({
        ...event,
        id: event?._id || event?.id,
      }))
    : [];

  const categories = Array.from(new Set(validEvents.map((e) => e.category).filter(Boolean)));

  const filteredEvents = validEvents.filter((event) => {
    const matchesTitle = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      status === "all" ? true : event.status.toLowerCase() === status;
    const matchesCategory =
      category === "all" ? true : event.category === category;

    return matchesTitle && matchesStatus && matchesCategory;
  });

  const completedCount = filteredEvents.filter(
    (e) => e.status.toLowerCase() === "completed"
  ).length;
  const upcomingCount = filteredEvents.filter(
    (e) => e.status.toLowerCase() === "upcoming"
  ).length;
  const ongoingCount = filteredEvents.filter(
    (e) => e.status.toLowerCase() === "ongoing"
  ).length;
  const cancelledCount = filteredEvents.filter(
    (e) => e.status.toLowerCase() === "cancelled"
  ).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "24px" }}>All Events Management</h1>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>
              {filteredEvents.length}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Total Events</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}>
              {upcomingCount}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Upcoming</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0891b2" }}>
              {ongoingCount}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>Ongoing</div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>
              {completedCount + cancelledCount}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              Completed/Cancelled
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Input
            placeholder="Search events..."
            size="large"
            value={search}
            onChange={onSearchFilter}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Select
            placeholder="Filter by category"
            size="large"
            value={category}
            onChange={onCategoryFilter}
            style={{ width: "100%" }}
          >
            <Select.Option value="all">All Categories</Select.Option>
            {categories.map((cat) => (
              <Select.Option key={cat} value={cat}>
                {cat}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={8}>
          <Radio.Group
            value={status}
            onChange={onStatusFilter}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              width: "100%",
            }}
          >
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="upcoming">Upcoming</Radio.Button>
            <Radio.Button value="ongoing">Ongoing</Radio.Button>
            <Radio.Button value="completed">Completed</Radio.Button>
            <Radio.Button value="cancelled">Cancelled</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* Events Grid */}
      <Row gutter={[24, 24]}>
        {filteredEvents.length === 0 ? (
          <Col span={24}>
            <Empty description="No events found." />
          </Col>
        ) : (
          filteredEvents.map((event) => (
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
                      src={event.bannerImage || event.cover}
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
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      {event.isApproved === "approved" && (
                        <Tag color="green" style={{ fontSize: 11, borderRadius: 4, fontWeight: 500 }}>
                          Approved
                        </Tag>
                      )}
                      {event.isApproved === "pending" && (
                        <Tag color="orange" style={{ fontSize: 11, borderRadius: 4, fontWeight: 500 }}>
                          Pending
                        </Tag>
                      )}
                      {event.isApproved === "rejected" && (
                        <Tag color="red" style={{ fontSize: 11, borderRadius: 4, fontWeight: 500 }}>
                          Rejected
                        </Tag>
                      )}
                    </div>
                  </div>
                }
                actions={[
                  <Button
                    type="primary"
                    key="detail"
                    style={{ borderRadius: 6, width: "90%" }}
                    size="medium"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    Detail
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="Delete Event"
                    description="Are you sure you want to delete this event?"
                    onConfirm={() => handleDeleteEvent(event.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      danger
                      style={{ borderRadius: 6, width: "90%" }}
                      size="medium"
                      loading={loadingId === event.id}
                    >
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
                  <b>Organized By:</b>{" "}
                  {typeof event.organizer === "object"
                    ? `${event.organizer.firstName} ${event.organizer.lastName}`
                    : event.organizer || "N/A"}
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Detail Drawer */}
      <Event_Detail
        event={selectedEvent}
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
      />
    </div>
  );
}

export default AdminEvents;
