import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Badge,
  Typography,
  Empty,
  Divider,
  Radio,
  Tooltip,
  Avatar,
  Popconfirm,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { getCurrentRole, getStoredUser } from "../../utils/auth";
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../Services/notificationService";

const { Text } = Typography;

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  blue:   "#1677ff",
  green:  "#52c41a",
  orange: "#fa8c16",
  red:    "#f5222d",
  purple: "#722ed1",
  cyan:   "#13c2c2",
  gold:   "#faad14",
  gray:   "#8c8c8c",
};

// ── Config per notification type ──────────────────────────────────────────────
const TYPE_CONFIG = {
  booking: {
    icon: <TeamOutlined />,
    color: C.blue,
    tagColor: "blue",
    label: "Booking",
  },
  event: {
    icon: <CalendarOutlined />,
    color: C.purple,
    tagColor: "purple",
    label: "Event",
  },
  payment: {
    icon: <DollarOutlined />,
    color: C.green,
    tagColor: "green",
    label: "Payment",
  },
  warning: {
    icon: <WarningOutlined />,
    color: C.orange,
    tagColor: "orange",
    label: "Warning",
  },
  cancelled: {
    icon: <CloseCircleOutlined />,
    color: C.red,
    tagColor: "red",
    label: "Cancelled",
  },
  user: {
    icon: <UserOutlined />,
    color: C.cyan,
    tagColor: "cyan",
    label: "User",
  },
  info: {
    icon: <InfoCircleOutlined />,
    color: C.gray,
    tagColor: "default",
    label: "System",
  },
};

// ── Stat Card (mini) ──────────────────────────────────────────────────────────
function MiniStatCard({ label, value, color, icon }) {
  return (
    <Card
      style={{
        borderRadius: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        borderTop: `4px solid ${color}`,
        textAlign: "center",
        height: "100%",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: color + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color,
          margin: "0 auto 10px",
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "#1a1a2e" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{label}</div>
    </Card>
  );
}

// ── Single Notification Row ───────────────────────────────────────────────────
function NotificationItem({ notification, onMarkRead, onDelete }) {
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 18px",
        borderRadius: 12,
        background: notification.read ? "#fff" : cfg.color + "08",
        border: `1px solid ${notification.read ? "#f0f0f0" : cfg.color + "30"}`,
        transition: "background 0.2s",
        marginBottom: 10,
      }}
    >
      {/* Avatar / Icon */}
      <div style={{ flexShrink: 0 }}>
        <Avatar
          icon={cfg.icon}
          style={{
            background: cfg.color + "18",
            color: cfg.color,
            fontSize: 18,
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontWeight: notification.read ? 600 : 700, fontSize: 14, color: "#1a1a2e" }}>
            {notification.title}
          </span>
          {!notification.read && (
            <Badge color={cfg.color} />
          )}
          <Tag
            color={cfg.tagColor}
            style={{ fontSize: 11, borderRadius: 6, marginLeft: "auto" }}
          >
            {cfg.label}
          </Tag>
        </div>
        <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5, marginBottom: 6 }}>
          {notification.message}
        </div>
        <Text style={{ fontSize: 11, color: "#aaa" }}>{notification.time}</Text>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        {!notification.read && (
          <Tooltip title="Mark as read">
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => onMarkRead(notification.id)}
              style={{ color: C.green, borderRadius: 6 }}
            />
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <Popconfirm
            title="Delete this notification?"
            onConfirm={() => onDelete(notification.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ borderRadius: 6 }}
            />
          </Popconfirm>
        </Tooltip>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = getStoredUser();
  const currentRole = getCurrentRole();

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await fetchNotifications(
          currentRole === "admin"
            ? {}
            : currentUser?.id
              ? { recipientId: currentUser.id }
              : {},
        );

        if (!isMounted) {
          return;
        }

        setNotifications(data);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Unable to load notifications.");
          setNotifications([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [currentRole, currentUser?.id]);

  const unreadCount   = notifications.filter((n) => !n.read).length;
  const bookingCount  = notifications.filter((n) => n.type === "booking").length;
  const paymentCount  = notifications.filter((n) => n.type === "payment").length;
  const warningCount  = notifications.filter((n) => n.type === "warning" || n.type === "cancelled").length;

  const categories = ["all", ...Array.from(new Set(notifications.map((n) => n.category)))];

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesRead =
        filter === "all" ? true : filter === "unread" ? !n.read : n.read;
      const matchesCat =
        categoryFilter === "all" ? true : n.category === categoryFilter;
      return matchesRead && matchesCat;
    });
  }, [notifications, filter, categoryFilter]);

  async function handleMarkRead(id) {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      setErrorMessage(error.message || "Unable to update notification.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      setErrorMessage(error.message || "Unable to delete notification.");
    }
  }

  async function handleMarkAllRead() {
    try {
      if (currentRole !== "admin" && currentUser?.id) {
        await markAllNotificationsAsRead(currentUser.id);
      } else {
        await Promise.all(
          notifications
            .filter((notification) => !notification.read)
            .map((notification) => markNotificationAsRead(notification.id)),
        );
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      setErrorMessage(error.message || "Unable to update notifications.");
    }
  }

  async function handleClearAll() {
    try {
      await Promise.all(notifications.map((notification) => deleteNotification(notification.id)));
      setNotifications([]);
    } catch (error) {
      setErrorMessage(error.message || "Unable to clear notifications.");
    }
  }

  return (
    <div style={{ padding: "10px" }}>

      {/* ── Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge
                count={unreadCount}
                style={{ background: C.red, fontWeight: 700, fontSize: 13 }}
              />
            )}
          </div>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
            Stay updated with bookings, events, payments, and system alerts.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {unreadCount > 0 && (
            <Button
              icon={<CheckCircleOutlined />}
              size="large"
              style={{ borderRadius: 8, color: C.green, borderColor: C.green }}
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </Button>
          )}
          <Popconfirm
            title="Clear all notifications?"
            onConfirm={handleClearAll}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<ClearOutlined />}
              size="large"
              danger
              style={{ borderRadius: 8 }}
            >
              Clear All
            </Button>
          </Popconfirm>
        </div>
      </div>

      {/* ── Summary Stats */}
      {errorMessage && (
        <Card
          style={{
            borderRadius: 14,
            marginBottom: 20,
            borderColor: "#ffccc7",
            background: "#fff2f0",
          }}
        >
          <Text style={{ color: "#cf1322", fontWeight: 600 }}>{errorMessage}</Text>
        </Card>
      )}

      {isLoading && (
        <Card
          style={{
            borderRadius: 14,
            marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          }}
        >
          <Text style={{ color: "#666" }}>Loading notifications...</Text>
        </Card>
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <MiniStatCard
            label="Total Notifications"
            value={notifications.length}
            color={C.blue}
            icon={<BellOutlined />}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <MiniStatCard
            label="Unread"
            value={unreadCount}
            color={C.red}
            icon={<InfoCircleOutlined />}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <MiniStatCard
            label="Booking Alerts"
            value={bookingCount}
            color={C.purple}
            icon={<TeamOutlined />}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <MiniStatCard
            label="Warnings"
            value={warningCount}
            color={C.orange}
            icon={<WarningOutlined />}
          />
        </Col>
      </Row>

      {/* ── Filters */}
      <Card
        style={{
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          marginBottom: 20,
        }}
      >
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} md={10}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <FilterOutlined style={{ color: C.blue }} />
              <Text style={{ fontWeight: 600, fontSize: 13 }}>Read Status</Text>
            </div>
            <Radio.Group
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="large"
              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
              <Radio.Button value="all">All</Radio.Button>
              <Radio.Button value="unread">
                Unread{unreadCount > 0 && ` (${unreadCount})`}
              </Radio.Button>
              <Radio.Button value="read">Read</Radio.Button>
            </Radio.Group>
          </Col>
          <Col xs={24} md={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <FilterOutlined style={{ color: C.purple }} />
              <Text style={{ fontWeight: 600, fontSize: 13 }}>Category</Text>
            </div>
            <Radio.Group
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              size="large"
              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
            >
              {categories.map((cat) => (
                <Radio.Button key={cat} value={cat} style={{ textTransform: "capitalize" }}>
                  {cat === "all" ? "All" : cat}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Col>
        </Row>
      </Card>

      {/* ── Notification List */}
      <Card
        style={{
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}
        bodyStyle={{ padding: "20px" }}
      >
        {/* Unread Section */}
        {filtered.some((n) => !n.read) && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: C.red, fontSize: 16 }}>
                  <BellOutlined />
                </span>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
                  New
                </span>
                <Badge
                  count={filtered.filter((n) => !n.read).length}
                  style={{ background: C.red }}
                />
              </div>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={handleMarkAllRead}
                style={{ color: C.green, fontWeight: 600, padding: 0 }}
              >
                Mark all read
              </Button>
            </div>

            {filtered
              .filter((n) => !n.read)
              .map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
            <Divider style={{ margin: "20px 0" }} />
          </>
        )}

        {/* Read / Earlier Section */}
        {filtered.some((n) => n.read) && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ color: C.gray, fontSize: 16 }}>
                <CheckCircleOutlined />
              </span>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>Earlier</span>
            </div>
            {filtered
              .filter((n) => n.read)
              .map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
          </>
        )}

        {/* Empty State */}
        {filtered.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#aaa", fontSize: 14 }}>
                No notifications found for the selected filter.
              </span>
            }
            style={{ padding: "40px 0" }}
          />
        )}
      </Card>
    </div>
  );
}

export default Notifications;