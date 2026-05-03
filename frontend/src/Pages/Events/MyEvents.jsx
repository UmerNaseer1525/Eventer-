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
import { deleteEventAsync, getAllEvents, updateEventStatusAsync } from "../../Services/eventSlice";
import Event_Detail from "../../Components/Event_Detail";
import EventApprovalQueue from "../../Components/EventApprovalQueue";
import { getStoredUser } from "../../Services/helpers";
import { useEffect } from "react";

// using direct _id checks for organizer resolution

function MyEvents() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const eventsData = useSelector((state) => state.event.eventsData);
  const pendingEvents = useSelector((state) => state.event.pendingAprovalEvents);
  const rejectedEvents = useSelector((state) => state.event.rejectedEvents);
  const dispatch = useDispatch();
  const currentUser = getStoredUser();
  const currentUserId = currentUser?._id || currentUser?.id || "";
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectEditEvent, setSelectEditEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventApprovalQueueOpen, setIsEventApprovalQueueOpen] =
    useState(false);

    useEffect(() => {
        dispatch(getAllEvents());
      }, [dispatch]);
  function onSearchFilter(e) {
    setSearch(e.target.value);
  }

  function onStatusFilter(e) {
    setStatus(e.target.value);
  }

  function handleStatusChange(eventId, value) {
    console.log(eventId, value)
    dispatch(updateEventStatusAsync({ id: eventId, status: value }));
  }

  const ownedEvents = [...(Array.isArray(eventsData) ? eventsData : [])].filter(
    (event) => !currentUserId || ((event.organizer && (event.organizer._id || event.organizer.id)) === currentUserId),
  );

  const filteredEvents = ownedEvents
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
    });

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
            return (
              <Col
                key={event._id}
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
                        dispatch(deleteEventAsync(event._id));
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
                      value={String(event.status || "").toLowerCase()}
                      onChange={(value) => handleStatusChange(event._id, value)}
                      options={[
                        { label: "Upcoming", value: "upcoming" },
                        { label: "Ongoing", value: "ongoing" },
                        { label: "Cancelled", value: "cancelled" },
                        { label: "Completed", value: "completed" },
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
