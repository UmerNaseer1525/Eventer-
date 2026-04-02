import { Card, Row, Col, Radio, Tag, Input, Button } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import Event_Detail from "../../Components/Event_Detail";

function Bookings() {
  const bookings = useSelector((state) => state.booking);
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
                    src={event.bannerImage}
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
