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
  Paid: { color: "success", text: "Paid" },
  Unpaid: { color: "warning", text: "Unpaid" },
  Refunded: { color: "default", text: "Refunded" },
};

function BookingDetailModal({ booking, open, onClose }) {
  if (!booking) return null;

  const payCfg =
    PAY_STATUS_CONFIG[booking.paymentStatus] || PAY_STATUS_CONFIG.Unpaid;

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
          src={booking.cover}
          alt={booking.name}
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
          {booking.category}
        </Tag>
        <Tag
          color={STATUS_COLOR[booking.status] || "default"}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontWeight: 600,
            borderRadius: 20,
            padding: "2px 12px",
          }}
        >
          {booking.status}
        </Tag>
      </div>

      <div style={{ padding: "20px 24px 16px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800 }}>
          {booking.name}
        </h2>
        <Descriptions
          column={1}
          size="small"
          bordered
          labelStyle={{ fontWeight: 600, width: 130 }}
        >
          <Descriptions.Item label="Booking ID">{booking.id}</Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <EnvironmentOutlined /> Location
              </span>
            }
          >
            {booking.location}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <PhoneOutlined /> Contact
              </span>
            }
          >
            {booking.contact || "-"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <CalendarOutlined /> Date
              </span>
            }
          >
            {booking.date} {booking.time ? `· ${booking.time}` : ""}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span>
                <DollarOutlined /> Amount
              </span>
            }
          >
            <span style={{ fontWeight: 800, color: "#1677ff", fontSize: 16 }}>
              ${booking.amount}
            </span>
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
