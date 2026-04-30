import { Modal, Button, Tag, Descriptions } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const STATUS_COLOR = {
  Upcoming: "blue",
  Ongoing: "green",
  Completed: "default",
  Cancelled: "red",
};

const PAY_STATUS_CONFIG = {
  paid: { color: "success", text: "Paid" },
  pending: { color: "warning", text: "Pending" },
  failed: { color: "default", text: "Failed" },
};

function BookingDetailModal({ booking, open, onClose }) {
  if (!booking) return null;

  const event = booking.event;
  const attendee = booking.attendee;
  const organizer = event.organizer;
  
  const paymentKey = String(booking.paymentStatus).toLowerCase();
  const payCfg = PAY_STATUS_CONFIG[paymentKey] || PAY_STATUS_CONFIG.pending;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <Button
          type="primary"
          block
          onClick={onClose}
          style={{ borderRadius: 8 }}
        >
          Close
        </Button>
      }
      width={500}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={event.bannerImage}
          alt={event.title}
          style={{
            width: "100%",
            height: 190,
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
            borderRadius: 20,
            padding: "2px 12px",
          }}
        >
          {event.category}
        </Tag>
        <Tag
          color={STATUS_COLOR[event.status] || "default"}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: 600,
            borderRadius: 20,
            padding: "2px 12px",
          }}
        >
          {event.status}
        </Tag>
      </div>

      <div style={{ padding: "20px 24px 16px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800 }}>
          {event.title}
        </h2>
        <Descriptions
          column={1}
          size="small"
          bordered
          labelStyle={{ fontWeight: 600, width: 130 }}
        >
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
            {attendee.phone}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <CalendarOutlined /> Date & Time
              </span>
            }
          >
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <DollarOutlined /> Amount
              </span>
            }
          >
            <span style={{ fontWeight: 800, color: "#1677ff", fontSize: 16 }}>
              ${booking.totalPrice}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Organizer">
            {organizer.firstName} {organizer.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Payment">
            <Tag
              color={payCfg.color}
              style={{ fontWeight: 600, borderRadius: 20 }}
            >
              {payCfg.text}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
}

export default BookingDetailModal;
