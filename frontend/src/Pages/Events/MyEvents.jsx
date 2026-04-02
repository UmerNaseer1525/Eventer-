import {
  EditOutlined,
  FileAddOutlined,
  AppstoreAddOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Button,
  Row,
  Col,
  Tag,
  Input,
  Radio,
  FloatButton,
  Tooltip,
  Empty,
  Alert,
  Select,
  Popconfirm,
} from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CreateEvent from "../../Components/CreateEvent";
import EditEvent from "../../Components/EditEvent";
import { deleteEvent, updateStatus } from "../../Services/eventSlice";
import Event_Detail from "../../Components/Event_Detail";
import EventApprovalQueue from "../../Components/EventApprovalQueue";

function MyEvents() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const events = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectEditEvent, setSelectEditEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventApprovalQueueOpen, setIsEventApprovalQueueOpen] =
    useState(false);

  function onSearchFilter(e) {
    setSearch(e.target.value);
  }

  function onStatusFilter(e) {
    setStatus(e.target.value);
  }

  function handleStatusChange(eventId, value) {
    dispatch(updateStatus({ id: eventId, status: value }));
  }

  const filteredEvents = Array.isArray(events)
    ? events
        .filter(
          (event) =>
            event &&
            typeof event.title === "string" &&
            typeof event.status === "string" &&
            typeof event.location === "string" &&
            typeof event.category === "string" &&
            event.bannerImage,
        )
        .filter((event) => {
          const matchesTitle = event.title
            .toLowerCase()
            .includes(search.toLowerCase());
          const matchesStatus =
            status === "all" ? true : event.status.toLowerCase() === status;
          return matchesTitle && matchesStatus;
        })
    : [];

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "20px" }}>My Events</h1>
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
      <Row gutter={[24, 24]}>
        {filteredEvents.length === 0 ? (
          <Col span={24}>
            <Empty description="No events found or invalid event data." />
          </Col>
        ) : (
          filteredEvents.map((event) => {
            let bookingDisabled = false;
            let bookingLabel = "Bookings";
            const statusLower = event.status.toLowerCase();
            if (statusLower === "completed" || statusLower === "cancelled") {
              bookingDisabled = true;
              bookingLabel = "Not Available";
            } else if (statusLower === "ongoing") {
              bookingDisabled = true;
              bookingLabel = "Contact Management";
            } else if (event.capacity <= 0) {
              bookingDisabled = true;
              bookingLabel = "Book Full";
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
                      <Tooltip title="Edit Event">
                        <Button
                          type="text"
                          icon={<EditOutlined style={{ color: "white" }} />}
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            backdropFilter: "blur(4px)",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "none",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditModalOpen(true);
                            setSelectEditEvent(event);
                          }}
                        />
                      </Tooltip>
                    </div>
                  }
                  actions={[
                    <Button
                      type="default"
                      key="detail"
                      size="medium"
                      style={{
                        borderRadius: 6,
                        width: "90%",
                      }}
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDrawerOpen(true);
                      }}
                    >
                      Detail
                    </Button>,
                    <Popconfirm
                      title="Delete Event"
                      description="Are You Sure?"
                      onConfirm={() => {
                        dispatch(deleteEvent({ id: event.id }));
                      }}
                      okText="Delete"
                      canelText="No"
                    >
                      <Button
                        type="default"
                        key="detail"
                        size="medium"
                        style={{
                          borderRadius: 6,
                          width: "90%",
                        }}
                        // onClick={() => {
                        //   dispatch(deleteEvent({ id: event.id }));
                        // }}
                        danger
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
                    <Select
                      defaultValue={event.status}
                      onChange={(value) => handleStatusChange(event.id, value)}
                      options={[
                        { label: "Upcoming", value: "Upcoming" },
                        { label: "Ongoing", value: "Ongoing" },
                        { label: "Cancelled", value: "Cancelled" },
                        { label: "Completed", value: "Completed" },
                      ]}
                    />
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
      <FloatButton.Group
        trigger="click"
        style={{ insetInlineEnd: 24 }}
        icon={<AppstoreAddOutlined />}
      >
        <Tooltip title="Pending/Not Approved Events">
          <FloatButton
            icon={<ClockCircleOutlined />}
            onClick={() => setIsEventApprovalQueueOpen(true)}
          />
        </Tooltip>
        <Tooltip title="Create Event">
          <FloatButton
            icon={<FileAddOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          />
        </Tooltip>
      </FloatButton.Group>
      <CreateEvent
        isOpen={isCreateModalOpen}
        onModalClose={() => setIsCreateModalOpen(false)}
      />
      <EditEvent
        isOpen={isEditModalOpen}
        onModalClose={() => setIsEditModalOpen(false)}
        record={selectEditEvent}
      />
      <Event_Detail
        event={selectedEvent}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <EventApprovalQueue
        open={isEventApprovalQueueOpen}
        onClose={() => setIsEventApprovalQueueOpen(false)}
      />
    </div>
  );
}

export default MyEvents;