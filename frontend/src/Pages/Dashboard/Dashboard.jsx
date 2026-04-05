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
} from "antd";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  getApprovedEvents,
  getPaidApprovedBookings,
  getCompletedApprovedPayments,
  getTotalRevenue,
} from "../../utils/insightScope";

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
  const events = useSelector((state) => state.event);
  const bookings = useSelector((state) => state.booking);
  const payments = useSelector((state) => state.payment);

  const validEvents = useMemo(() => getApprovedEvents(events), [events]);

  const paidBookings = useMemo(
    () => getPaidApprovedBookings(bookings, validEvents),
    [bookings, validEvents],
  );

  const completedPayments = useMemo(
    () => getCompletedApprovedPayments(payments, validEvents),
    [payments, validEvents],
  );

  const totalEvents = validEvents.length;
  const upcomingEvents = validEvents.filter(
    (e) => e.status.toLowerCase() === "upcoming",
  );
  const ongoingEvents = validEvents.filter(
    (e) => e.status.toLowerCase() === "ongoing",
  );
  const completedEvents = validEvents.filter(
    (e) => e.status.toLowerCase() === "completed",
  );
  const cancelledEvents = validEvents.filter(
    (e) => e.status.toLowerCase() === "cancelled",
  );

  const totalBookings = paidBookings.length;
  const totalRevenue = useMemo(
    () => getTotalRevenue(completedPayments, paidBookings),
    [completedPayments, paidBookings],
  );

  // Category breakdown
  const categoryMap = useMemo(() => {
    const map = {};
    validEvents.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + 1;
    });
    return Object.entries(map).map(([cat, count]) => ({ cat, count }));
  }, [validEvents]);

  // Status distribution for mini donut-style bars
  const statusData = [
    { label: "Upcoming", count: upcomingEvents.length, color: C.blue },
    { label: "Ongoing", count: ongoingEvents.length, color: C.green },
    { label: "Completed", count: completedEvents.length, color: C.purple },
    { label: "Cancelled", count: cancelledEvents.length, color: C.red },
  ];

  const catColors = [
    C.blue,
    C.purple,
    C.orange,
    C.cyan,
    C.green,
    C.gold,
    C.red,
  ];

  // Recent 6 events for activity feed
  const recentEvents = useMemo(
    () => [...validEvents].slice(0, 6),
    [validEvents],
  );

  // Quick metric cards
  const quickMetrics = [
    {
      label: "Upcoming Events",
      value: upcomingEvents.length,
      icon: "🗓️",
      color: C.blue,
    },
    {
      label: "Ongoing Events",
      value: ongoingEvents.length,
      icon: "🔴",
      color: C.green,
    },
    {
      label: "Completed Events",
      value: completedEvents.length,
      icon: "✅",
      color: C.purple,
    },
    {
      label: "Cancelled Events",
      value: cancelledEvents.length,
      icon: "❌",
      color: C.red,
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      {/* ── Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}
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
            change={12.5}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={<TeamOutlined />}
            color={C.purple}
            change={8.2}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
            prefix="$"
            icon={<DollarOutlined />}
            color={C.green}
            change={23.5}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Growth Rate"
            value={23.5}
            suffix="%"
            icon={<RiseOutlined />}
            color={C.orange}
            change={4.1}
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
              <div style={{ fontSize: 12, color: "#888" }}>{m.label}</div>
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
                <ActivityItem key={event?.id ?? i} event={event} index={i} />
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
              subtitle={`${upcomingEvents.length} events scheduled`}
            />
            {upcomingEvents.length === 0 ? (
              <Empty description="No upcoming events" />
            ) : (
              upcomingEvents.slice(0, 5).map((event, i) => (
                <div
                  key={event?.id ?? i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom:
                      i < upcomingEvents.slice(0, 5).length - 1
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
                    style={{ borderRadius: 6, fontSize: 11, fontWeight: 500 }}
                  >
                    {event?.category}
                  </Tag>
                </div>
              ))
            )}
          </Card>
        </Col>
      </Row>

      {/* ── Booking Summary + Organizer Highlights */}
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
              title="Booking Overview"
              subtitle="Bookings made per event"
            />
            {validEvents.length === 0 ? (
              <Empty description="No events" />
            ) : (
              validEvents.slice(0, 6).map((event, i) => {
                const eventBookings = Array.isArray(bookings)
                  ? bookings.filter(
                      (b) => b?.eventId === event?.id || b?.id === event?.id,
                    ).length
                  : 0;
                const guests = event?.number_of_guests || 100;
                const pct = Math.min(
                  100,
                  Math.round((eventBookings / guests) * 100),
                );
                return (
                  <div
                    key={event?.id ?? i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 110,
                        fontSize: 12,
                        color: "#555",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event?.title}
                    </span>
                    <Progress
                      percent={pct}
                      showInfo={false}
                      strokeColor={
                        pct > 70 ? C.green : pct > 40 ? C.blue : C.gold
                      }
                      trailColor="#f5f5f5"
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                    <span
                      style={{
                        width: 32,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#555",
                        textAlign: "right",
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })
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
              icon={<UserOutlined />}
              title="Top Organizers"
              subtitle="Most active event organizers"
            />
            {validEvents.length === 0 ? (
              <Empty description="No organizer data" />
            ) : (
              (() => {
                const orgMap = {};
                validEvents.forEach((e) => {
                  const org = e?.organizer ?? "Unknown";
                  orgMap[org] = (orgMap[org] || 0) + 1;
                });
                const sorted = Object.entries(orgMap)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5);
                const max = sorted[0]?.[1] || 1;

                return sorted.map(([org, count], i) => (
                  <div
                    key={org}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 0",
                      borderBottom:
                        i < sorted.length - 1 ? "1px solid #f5f5f5" : "none",
                    }}
                  >
                    <Avatar
                      size={34}
                      style={{
                        background: catColors[i % catColors.length] + "20",
                        color: catColors[i % catColors.length],
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {org[0]?.toUpperCase()}
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: "#1a1a2e",
                        }}
                      >
                        {org}
                      </div>
                      <Progress
                        percent={Math.round((count / max) * 100)}
                        showInfo={false}
                        strokeColor={catColors[i % catColors.length]}
                        trailColor="#f5f5f5"
                        size="small"
                        style={{ marginBottom: 0, marginTop: 4 }}
                      />
                    </div>
                    <Tag
                      color={
                        catColors[i % catColors.length] === C.red
                          ? "red"
                          : "default"
                      }
                      style={{
                        borderRadius: 6,
                        fontWeight: 700,
                        background: catColors[i % catColors.length] + "15",
                        color: catColors[i % catColors.length],
                        border: "none",
                      }}
                    >
                      {count} event{count !== 1 ? "s" : ""}
                    </Tag>
                  </div>
                ));
              })()
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
