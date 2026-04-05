import React from "react";
import {
  Drawer,
  Typography,
  Tag,
  Badge,
  Row,
  Col,
  Divider,
  Button,
  Descriptions,
  Space,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const statusColors = {
  Upcoming: "blue",
  Ongoing: "green",
  Completed: "gray",
  Cancelled: "red",
};

export default function Event_Detail({ open, onClose, onBook, event }) {
  if (!event) return null;
  const remainingSeats = Math.max(
    0,
    Number(
      event.remainingSeats ?? event.number_of_guests ?? event.capacity ?? 0,
    ),
  );
  return (
    <Drawer
      title={
        <Space direction="vertical" size={0}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {event.title}
          </Typography.Title>
          <Space>
            <Tag color="purple">{event.category}</Tag>
            <Badge
              color={statusColors[event.status] || "default"}
              text={event.status}
            />
          </Space>
        </Space>
      }
      placement="right"
      width={480}
      onClose={onClose}
      open={open}
      bodyStyle={{ padding: 0, background: "#fafbfc" }}
    >
      <div
        style={{
          width: "100%",
          height: 220,
          background: `url(${event.bannerImage}) center/cover no-repeat`,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />
      <div style={{ padding: 24 }}>
        <Descriptions
          column={1}
          bordered
          size="middle"
          labelStyle={{ width: 120, fontWeight: 500 }}
        >
          <Descriptions.Item
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CalendarOutlined /> <span>Date</span>
              </span>
            }
          >
            {event.date || "-"} {event.time ? `/ ${event.time}` : null}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <EnvironmentOutlined /> <span>Location</span>
              </span>
            }
          >
            {event.location}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <UserOutlined /> <span>Organizer</span>
              </span>
            }
          >
            {event.organizer || "-"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TeamOutlined /> <span>Seats Left</span>
              </span>
            }
          >
            {remainingSeats}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Ticket Price
              </span>
            }
          >
            {event.ticketPrice}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Typography.Title level={5}>Description</Typography.Title>
        <Typography.Paragraph style={{ minHeight: 60 }}>
          {event.description || "No description provided."}
        </Typography.Paragraph>
        {onBook ? (
          <Button
            type="primary"
            block
            style={{ borderRadius: 8, marginTop: 12 }}
            disabled={remainingSeats <= 0}
            onClick={onBook}
          >
            {remainingSeats <= 0 ? "Sold Out" : "Book Now"}
          </Button>
        ) : null}
      </div>
    </Drawer>
  );
}
