import { Modal } from "antd";
import React, { useState } from "react";

function Pending_Not_Approved({ eventList }) {
  const [isLoading, setIsLoading] = useState(false);

  function handleRequestAgain(event) {
    setIsLoading(true);
    setTimeout(() => {
      console.log(event);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Modal>
      {eventList.map((event) => {
        let bookingDisabled = false;
        let bookingLabel = "Request Again";

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
                <Button type="primary" key="detail" style={{ borderRadius: 6 }}>
                  Detail
                </Button>,
                <Button
                  key="bookings"
                  loading={isLoading}
                  style={{ borderRadius: 6 }}
                  onClick={() => handleRequestAgain(event)}
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
      })}
    </Modal>
  );
}

export default Pending_Not_Approved;
