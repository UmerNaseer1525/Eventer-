import { Card, Row, Col, Radio, Tag, Input, Button, Empty } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import Event_Detail from "../../Components/Event_Detail";

// ── Dummy data (used when Redux store is empty) ───────────────────────────────
const DUMMY_BOOKINGS = [
  {
    id: "1",
    title: "Tech Conference 2026",
    name: "Tech Conference 2026",
    category: "Conference",
    location: "Expo Center, City A",
    contact: "+1234567890",
    organizer: "TechWorld Inc.",
    status: "Upcoming",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    title: "Music Festival",
    name: "Music Festival",
    category: "Concert",
    location: "Open Grounds, City B",
    contact: "+9876543210",
    organizer: "SoundWave Events",
    status: "Ongoing",
    bannerImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    title: "Startup Summit",
    name: "Startup Summit",
    category: "Conference",
    location: "Innovation Hub, City D",
    contact: "+1122334455",
    organizer: "StartupXYZ",
    status: "Upcoming",
    bannerImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
    cover: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    title: "Photography Workshop",
    name: "Photography Workshop",
    category: "Workshop",
    location: "Studio 7, City A",
    contact: "+1231231234",
    organizer: "SnapMasters",
    status: "Completed",
    bannerImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80",
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "5",
    title: "Jazz Night",
    name: "Jazz Night",
    category: "Concert",
    location: "Blue Room, City E",
    contact: "+9988776655",
    organizer: "Jazz Club Official",
    status: "Cancelled",
    bannerImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
    cover: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "6",
    title: "Art & Design Expo",
    name: "Art & Design Expo",
    category: "Exhibition",
    location: "City Gallery, City C",
    contact: "+5556667777",
    organizer: "ArtSpace Collective",
    status: "Upcoming",
    bannerImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    cover: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
  },
];

function Bookings() {
  const reduxBookings = useSelector((state) => state.booking);

  // Use Redux bookings if available, otherwise fall back to dummy data
  const bookings =
    Array.isArray(reduxBookings) && reduxBookings.length > 0
      ? reduxBookings
      : DUMMY_BOOKINGS;

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "20px" }}>Bookings</h1>
      <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Event Name"
            size="large"
            // value={search}
            // onChange={onSearchFilter}
          />
        </Col>
        <Col xs={24} sm={12} md={16} lg={18}>
          <Radio.Group
            style={{ marginLeft: 16 }}
            value={status}
            // onChange={onStatusFilter}
          >
            <Radio.Button value={"all"} size="large">
              All
            </Radio.Button>
            <Radio.Button value={"upcoming"} size="large">
              Upcoming
            </Radio.Button>
            <Radio.Button value={"completed"} size="large">
              Completed
            </Radio.Button>
            <Radio.Button value={"ongoing"} size="large">
              Ongoing
            </Radio.Button>
            <Radio.Button value={"cancelled"} size="large">
              Cancelled
            </Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {bookings.map((event) => (
          <Col xs={24} sm={12} md={8} lg={6} key={event.id}>
            <Card
              hoverable
              style={{ borderRadius: 12, boxShadow: "0 2px 12px #f0f1f2" }}
              cover={
                <div style={{ position: "relative" }}>
                  <img
                    alt={event.title}
                    src={event.bannerImage ?? event.cover}
                    style={{
                      height: 180,
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
                  type="default"
                  key="detail"
                  style={{ borderRadius: 6, width: "90%" }}
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsDetailDrawerOpen(true);
                  }}
                >
                  Detail
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
                <b>Organized By:</b> {event?.organizer ?? "Unknown"}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Event_Detail
        open={isDetailDrawerOpen}
        event={selectedEvent}
        onClose={() => setIsDetailDrawerOpen(false)}
      />
    </div>
  );
}

export default Bookings;