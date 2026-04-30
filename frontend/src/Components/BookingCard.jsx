import { Card, Tag, Button } from "antd";

const STATUS_COLOR = {
  Upcoming: "blue",
  Ongoing: "green",
  Completed: "default",
  Cancelled: "red",
};

function BookingCard({ booking, onDetail, onCancelSeat }) {
  const event = booking.event;
  const organizer = event.organizer;
  
  const paymentStatus = booking.paymentStatus === "paid" ? "Paid" : booking.paymentStatus === "pending" ? "Pending" : "Failed";
  const canCancelSeat = booking.paymentStatus !== "failed" && event.status !== "Completed";

  return (
    <Card
      hoverable
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 12px #f0f1f2",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
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
          key="detail"
          type="default"
          style={{ borderRadius: 6, width: "90%" }}
          onClick={() => onDetail(booking)}
        >
          Detail
        </Button>,
        canCancelSeat ? (
          <Button
            key="cancel-seat"
            danger
            style={{ borderRadius: 6, width: "90%" }}
            onClick={() => onCancelSeat(booking)}
          >
            Cancel Seat
          </Button>
        ) : (
          <Button
            key="cancel-seat-disabled"
            disabled
            danger
            style={{ borderRadius: 6, width: "90%" }}
          >
            Cancel Seat
          </Button>
        ),
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
          color={paymentStatus === "Paid" ? "green" : paymentStatus === "Pending" ? "orange" : "red"}
          style={{ fontWeight: 500, fontSize: 13, borderRadius: 6 }}
        >
          {paymentStatus}
        </Tag>
      </div>

      <div style={{ marginBottom: 4, color: "#555" }}>
        <b>Location:</b> {event.location}
      </div>
      <div style={{ marginBottom: 4, color: "#555" }}>
        <b>Organized By:</b> {organizer.firstName} {organizer.lastName}
      </div>
      <div style={{ marginBottom: 12, color: "#555" }}>
        <b>Amount:</b> ${booking.totalPrice}
      </div>
    </Card>
  );
}

export default BookingCard;
