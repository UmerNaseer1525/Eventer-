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

export default function Event_Detail({ open, onClose, event }) {
  if (!event) return null;
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
      {/* Cover Image */}
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
              <>
                <CalendarOutlined /> Date
              </>
            }
          >
            {event.date || "-"} {event.time ? `/ ${event.time}` : null}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <EnvironmentOutlined /> Location
              </>
            }
          >
            {event.location}
          </Descriptions.Item>
          {/* Contact field removed, not in Event model */}
          <Descriptions.Item
            label={
              <>
                <UserOutlined /> Organizer
              </>
            }
          >
            {event.organizer || "-"}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <TeamOutlined /> Capacity
              </>
            }
          >
            {event.capacity}
          </Descriptions.Item>

          <Descriptions.Item label={<>Ticket Price</>}>
            {event.ticketPrice}
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        <Typography.Title level={5}>Description</Typography.Title>
        <Typography.Paragraph style={{ minHeight: 60 }}>
          {event.description || "No description provided."}
        </Typography.Paragraph>
      </div>
    </Drawer>
  );
}
