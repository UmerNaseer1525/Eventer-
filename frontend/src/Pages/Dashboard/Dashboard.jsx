import {
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  FireOutlined,
  TrophyOutlined,
  BellOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Tag,
  Badge,
  Avatar,
  Progress,
  Statistic,
  Typography,
  List,
  Divider,
  Empty,
  Spin,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchUserDashboard } from "../../Services/dashboardSlice";

const { Text, Title } = Typography;

// ── Colors ─────────────────────────────────────────────────────────────────────
const C = {
  blue: "#1677ff",
  green: "#52c41a",
  orange: "#fa8c16",
  red: "#f5222d",
  purple: "#722ed1",
  cyan: "#13c2c2",
  gold: "#faad14",
};

// ── Stat Card (same as Analytics) ──────────────────────────────────────────────
function StatCard({ title, value, prefix, suffix, icon, color, change }) {
  const isUp = change >= 0;
  return (
    <Card
      style={{
        borderRadius: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        borderTop: `4px solid ${color}`,
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: "#888",
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            {title}
          </div>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ fontSize: 26, fontWeight: 900, color: "#1a1a2e" }}
          />
          {change !== undefined && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {isUp ? (
                <ArrowUpOutlined style={{ color: C.green, fontSize: 12 }} />
              ) : (
                <ArrowDownOutlined style={{ color: C.red, fontSize: 12 }} />
              )}
              <Text
                style={{
                  fontSize: 12,
                  color: isUp ? C.green : C.red,
                  fontWeight: 600,
                }}
              >
                {Math.abs(change)}%
              </Text>
              <Text style={{ fontSize: 12, color: "#aaa" }}>vs last month</Text>
            </div>
          )}
        </div>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            background: color + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ── Section Header (same as Analytics) ─────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.blue, fontSize: 16 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
          {title}
        </span>
      </div>
      {subtitle && (
        <div
          style={{ fontSize: 12, color: "#aaa", marginTop: 3, marginLeft: 26 }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

// ── Status Tag helper ───────────────────────────────────────────────────────────
function StatusTag({ status }) {
  const s = status?.toLowerCase();
  const map = {
    upcoming: { color: "blue", icon: <ClockCircleOutlined /> },
    ongoing: { color: "green", icon: <SyncOutlined spin /> },
    completed: { color: "default", icon: <CheckCircleOutlined /> },
    cancelled: { color: "red", icon: <CloseCircleOutlined /> },
  };
  const cfg = map[s] || { color: "default", icon: null };
  return (
    <Tag
      color={cfg.color}
      icon={cfg.icon}
      style={{ borderRadius: 6, fontWeight: 500 }}
    >
      {status}
    </Tag>
  );
}

// ── Mini Bar (for category breakdown) ──────────────────────────────────────────
function MiniBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <span style={{ width: 90, fontSize: 12, color: "#555", flexShrink: 0 }}>
        {label}
      </span>
      <Progress
        percent={pct}
        showInfo={false}
        strokeColor={color}
        trailColor="#f5f5f5"
        style={{ flex: 1, marginBottom: 0 }}
      />
      <span
        style={{
          width: 28,
          fontSize: 12,
          fontWeight: 700,
          color,
          textAlign: "right",
        }}
      >
        {count}
      </span>
    </div>
  );
}

// ── Activity Item ───────────────────────────────────────────────────────────────
function ActivityItem({ event, index }) {
  const colors = [C.blue, C.purple, C.green, C.orange, C.cyan, C.gold];
  const color = colors[index % colors.length];
  const s = event?.status?.toLowerCase();

  const actionMap = {
    upcoming: "New event scheduled",
    ongoing: "Event is now live",
    completed: "Event completed",
    cancelled: "Event was cancelled",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #f5f5f5",
      }}
    >
      <Avatar
        size={38}
        style={{
          background: color + "20",
          color,
          flexShrink: 0,
          fontWeight: 700,
        }}
      >
        {event?.title?.[0]?.toUpperCase() ?? "E"}
      </Avatar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: "#1a1a2e",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event?.title ?? "Unknown Event"}
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
          {actionMap[s] ?? "Event updated"} &bull; {event?.location ?? "—"}
        </div>
      </div>
      <StatusTag status={event?.status} />
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────────
function Dashboard() {
  
  const dispatch = useDispatch();
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("user") || "null");
  } catch (_error) {
    currentUser = null;
  }
  const dashboard = useSelector((state) => state.dashboard.user);
  const loading = useSelector((state) => state.dashboard.loading);
  const error = useSelector((state) => state.dashboard.error);


  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserDashboard(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  const stats = dashboard?.stats || {};
  const recentEvents = dashboard?.recentEvents || [];

  const totalEvents = stats.totalEvents || 0;
  const totalBookings = stats.totalBookings || 0;
  const totalRevenue = stats.totalRevenue || 0;

  const upcomingEvents = stats.upcomingEvents || 0;
  const ongoingEvents = stats.ongoingEvents || 0;
  const completedEvents = stats.completedEvents || 0;
  const cancelledEvents = stats.cancelledEvents || 0;

  // Status distribution for mini donut-style bars
  const statusData = [
    { label: "Upcoming", count: upcomingEvents, color: C.blue },
    { label: "Ongoing", count: ongoingEvents, color: C.green },
    { label: "Completed", count: completedEvents, color: C.purple },
    { label: "Cancelled", count: cancelledEvents, color: C.red },
  ];

  // Category breakdown (we can add this to the backend later if needed)
  const categoryMap = useMemo(() => {
    const map = {};
    recentEvents.forEach((e) => {
      const catName = e.category?.name || e.category || "Other";
      map[catName] = (map[catName] || 0) + 1;
    });
    return Object.entries(map).map(([cat, count]) => ({ cat, count }));
  }, [recentEvents]);

  const catColors = [
    C.blue,
    C.purple,
    C.orange,
    C.cyan,
    C.green,
    C.gold,
    C.red,
  ];

  // Quick metric cards
  const quickMetrics = [
    {
      label: "Upcoming Events",
      value: upcomingEvents,
      icon: "🗓️",
      color: C.blue,
    },
    {
      label: "Ongoing Events",
      value: ongoingEvents,
      icon: "🔴",
      color: C.green,
    },
    {
      label: "Completed Events",
      value: completedEvents,
      icon: "✅",
      color: C.purple,
    },
    {
      label: "Cancelled Events",
      value: cancelledEvents,
      icon: "❌",
      color: C.red,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "10px", textAlign: "center" }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: "#888" }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "10px" }}>
        <Card
          style={{
            borderRadius: 14,
            marginBottom: 20,
            borderColor: "#ffccc7",
            background: "#fff2f0",
          }}
        >
          <Typography.Text style={{ color: "#cf1322", fontWeight: 600 }}>
            {error}
          </Typography.Text>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px" }}>
      {/* ── Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: "#888" }}>Loading dashboard...</p>
        </div>
      )}

      {/* ── Error State */}
      {error && !loading && (
        <Card
          style={{
            borderRadius: 14,
            marginBottom: 20,
            borderColor: "#ffccc7",
            background: "#fff2f0",
          }}
        >
          <Typography.Text style={{ color: "#cf1322", fontWeight: 600 }}>
            {error}
          </Typography.Text>
        </Card>
      )}

      {/* ── Main Content (only show if not loading) */}
      {!loading && (
        <>
          {/* ── Header */}
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: "#1a1a2e",
              }}
            >
              Dashboard
            </h1>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
              Welcome back! Here's what's happening with your events.
            </p>
          </div>

          {/* ── KPI Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={12} md={6}>
              <StatCard
                title="Total Events"
                value={totalEvents}
                icon={<CalendarOutlined />}
                color={C.blue}
              />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <StatCard
                title="Total Bookings"
                value={totalBookings}
                icon={<TeamOutlined />}
                color={C.purple}
              />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <StatCard
                title="Total Revenue"
                value={totalRevenue}
                prefix="$"
                icon={<DollarOutlined />}
                color={C.green}
              />
            </Col>
            <Col xs={12} sm={12} md={6}>
              <StatCard
                title="Paid Bookings"
                value={stats.paidBookings || 0}
                icon={<CheckCircleOutlined />}
                color={C.orange}
              />
            </Col>
          </Row>

          {/* ── Quick Metric Mini Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {quickMetrics.map((m) => (
              <Col key={m.label} xs={12} sm={12} md={6}>
                <Card
                  style={{
                    borderRadius: 14,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    textAlign: "center",
                    border: `1px solid ${m.color}22`,
                  }}
                >
                  <div style={{ fontSize: 28 }}>{m.icon}</div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: m.color,
                      margin: "6px 0 4px",
                    }}
                  >
                    {m.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {m.label}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* ── Event Status Breakdown + Category Breakdown */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  height: "100%",
                }}
              >
                <SectionHeader
                  icon={<FireOutlined />}
                  title="Events by Status"
                  subtitle="Current status breakdown"
                />
                {totalEvents === 0 ? (
                  <Empty description="No events yet" />
                ) : (
                  statusData.map((s) => (
                    <MiniBar
                      key={s.label}
                      label={s.label}
                      count={s.count}
                      total={totalEvents}
                      color={s.color}
                    />
                  ))
                )}
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  height: "100%",
                }}
              >
                <SectionHeader
                  icon={<TrophyOutlined />}
                  title="Events by Category"
                  subtitle="Distribution across types"
                />
                {categoryMap.length === 0 ? (
                  <Empty description="No categories yet" />
                ) : (
                  categoryMap.map(({ cat, count }, i) => (
                    <MiniBar
                      key={cat}
                      label={cat}
                      count={count}
                      total={totalEvents}
                      color={catColors[i % catColors.length]}
                    />
                  ))
                )}
              </Card>
            </Col>
          </Row>

          {/* ── Recent Activity + Upcoming Events */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {/* Recent Activity */}
            <Col xs={24} lg={14}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <SectionHeader
                  icon={<BellOutlined />}
                  title="Recent Activity"
                  subtitle="Latest event updates"
                />
                {recentEvents.length === 0 ? (
                  <Empty description="No recent activity" />
                ) : (
                  recentEvents.map((event, i) => (
                    <ActivityItem
                      key={event?.id ?? i}
                      event={event}
                      index={i}
                    />
                  ))
                )}
              </Card>
            </Col>

            {/* Upcoming Events list */}
            <Col xs={24} lg={10}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  height: "100%",
                }}
              >
                <SectionHeader
                  icon={<ClockCircleOutlined />}
                  title="Upcoming Events"
                  subtitle={`${upcomingEvents} events scheduled`}
                />
                {totalEvents === 0 ? (
                  <Empty description="No upcoming events" />
                ) : (
                  recentEvents.slice(0, 5).map((event, i) => (
                    <div
                      key={event?.id ?? i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom:
                          i < recentEvents.slice(0, 5).length - 1
                            ? "1px solid #f5f5f5"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: C.blue + "15",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: C.blue,
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        <CalendarOutlined />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#1a1a2e",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {event?.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#888",
                            marginTop: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <EnvironmentOutlined style={{ fontSize: 11 }} />
                          {event?.location}
                        </div>
                      </div>
                      <Tag
                        color="purple"
                        style={{
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {event?.category?.name || event?.category}
                      </Tag>
                    </div>
                  ))
                )}
              </Card>
            </Col>
          </Row>

          {/* ── Booking Summary + Top Events */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <SectionHeader
                  icon={<TeamOutlined />}
                  title="Recent Bookings"
                  subtitle="Latest bookings for your events"
                />
                {dashboard?.recentBookings?.length === 0 ? (
                  <Empty description="No bookings" />
                ) : (
                  (dashboard?.recentBookings || []).slice(0, 5).map((b, i) => (
                    <div
                      key={b?.id ?? i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom:
                          i <
                          Math.min(5, (dashboard?.recentBookings || []).length) -
                            1
                            ? "1px solid #f5f5f5"
                            : "none",
                      }}
                    >
                      <Avatar
                        size={34}
                        style={{
                          background: C.purple + "20",
                          color: C.purple,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {b?.attendee?.firstName?.[0]?.toUpperCase() || "B"}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#1a1a2e",
                          }}
                        >
                          {b?.attendee?.firstName +
                            " " +
                            b?.attendee?.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#888",
                            marginTop: 2,
                          }}
                        >
                          for {b?.event?.title}
                        </div>
                      </div>
                      <Tag color="blue" style={{ borderRadius: 6 }}>
                        {b?.paymentStatus || "pending"}
                      </Tag>
                    </div>
                  ))
                )}
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <SectionHeader
                  icon={<CalendarOutlined />}
                  title="Your Recent Events"
                  subtitle="Latest events you created"
                />
                {recentEvents.length === 0 ? (
                  <Empty description="No events yet" />
                ) : (
                  recentEvents.slice(0, 5).map((e, i) => (
                    <div
                      key={e?.id ?? i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 0",
                        borderBottom:
                          i < Math.min(5, recentEvents.length) - 1
                            ? "1px solid #f5f5f5"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: C.green + "15",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: C.green,
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        🎉
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#1a1a2e",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {e?.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#888",
                            marginTop: 2,
                          }}
                        >
                          {e?.status || "—"}
                        </div>
                      </div>
                      <Tag
                        color={e?.status === "published" ? "green" : "orange"}
                        style={{ borderRadius: 6, fontSize: 11 }}
                      >
                        {e?.status}
                      </Tag>
                    </div>
                  ))
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Dashboard;
