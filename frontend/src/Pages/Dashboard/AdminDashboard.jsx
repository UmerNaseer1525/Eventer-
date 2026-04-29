import {
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  CrownOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FireOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  SettingOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Tag,
  Table,
  Progress,
  Statistic,
  Typography,
  Avatar,
  Badge,
  Empty,
  Spin,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchAdminDashboard } from "../../Services/dashboardSlice";
import { buildTimelineData } from "../../Components/Insights/insightUtils";
import {
  getApprovedEvents,
  getPaidApprovedBookings,
  getCompletedApprovedPayments,
  getTotalRevenue,
} from "../../utils/insightScope";
const { Text } = Typography;

// ── Color Palette ──────────────────────────────────────────────────────────────
const C = {
  blue: "#1677ff",
  green: "#52c41a",
  orange: "#fa8c16",
  red: "#f5222d",
  purple: "#722ed1",
  cyan: "#13c2c2",
  gold: "#faad14",
};
const CAT_COLORS = [C.blue, C.purple, C.orange, C.cyan, C.green, C.gold, C.red];

// ── Static chart data ──────────────────────────────────────────────────────────
const MONTHLY = [
  { month: "Jan", revenue: 4200, bookings: 38, events: 5, users: 120 },
  { month: "Feb", revenue: 5800, bookings: 52, events: 7, users: 145 },
  { month: "Mar", revenue: 4900, bookings: 44, events: 6, users: 138 },
  { month: "Apr", revenue: 7200, bookings: 63, events: 9, users: 172 },
  { month: "May", revenue: 6100, bookings: 55, events: 8, users: 160 },
  { month: "Jun", revenue: 8900, bookings: 78, events: 11, users: 198 },
  { month: "Jul", revenue: 7500, bookings: 67, events: 10, users: 185 },
  { month: "Aug", revenue: 9800, bookings: 89, events: 13, users: 220 },
  { month: "Sep", revenue: 8300, bookings: 74, events: 11, users: 207 },
  { month: "Oct", revenue: 11200, bookings: 98, events: 15, users: 254 },
  { month: "Nov", revenue: 10100, bookings: 91, events: 14, users: 241 },
  { month: "Dec", revenue: 13500, bookings: 120, events: 18, users: 310 },
];

// ── Reusable: Stat Card ────────────────────────────────────────────────────────
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

// ── Reusable: Section Header ───────────────────────────────────────────────────
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

// ── Reusable: Bar Chart ────────────────────────────────────────────────────────
function BarChartAnt({ data, dataKey, color }) {
  const max = Math.max(1, ...data.map((d) => Number(d[dataKey]) || 0));
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height: 160,
        paddingBottom: 24,
        position: "relative",
      }}
    >
      {data.map((d, i) => {
        const pct = Math.round((d[dataKey] / max) * 100);
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>
              {d[dataKey] >= 1000
                ? `${(d[dataKey] / 1000).toFixed(1)}k`
                : d[dataKey]}
            </div>
            <div
              style={{
                width: "100%",
                borderRadius: "4px 4px 0 0",
                height: `${pct}%`,
                minHeight: 4,
                background: `linear-gradient(to top, ${color}, ${color}99)`,
                transition: "height 0.3s ease",
                cursor: "pointer",
              }}
              title={`${d.month}: ${d[dataKey]}`}
            />
            <div
              style={{
                fontSize: 10,
                color: "#aaa",
                position: "absolute",
                bottom: 0,
              }}
            >
              {d.month}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Reusable: Line Chart ───────────────────────────────────────────────────────
function LineChartAnt({ data, dataKey, color }) {
  const max = Math.max(...data.map((d) => d[dataKey]));
  const min = Math.min(...data.map((d) => d[dataKey]));
  const range = max - min || 1;
  const H = 130;
  const WSTEP = 100 / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * WSTEP,
    y: H - ((d[dataKey] - min) / range) * H,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H} L 0 ${H} Z`;

  return (
    <div style={{ position: "relative", height: H + 30, overflow: "hidden" }}>
      <svg
        width="100%"
        height={H + 4}
        viewBox={`0 0 100 ${H}`}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${dataKey})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="0.8" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.2" fill={color} />
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {data.map((d, i) => (
          <span
            key={i}
            style={{
              fontSize: 10,
              color: "#aaa",
              flex: 1,
              textAlign: "center",
            }}
          >
            {d.month}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Reusable: Donut Chart ──────────────────────────────────────────────────────
function DonutChart({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const safeTotal = total > 0 ? total : 1;
  const parts = [];

  segments.reduce((start, seg) => {
    const pct = (seg.value / safeTotal) * 100;
    const end = start + pct;
    parts.push(`${seg.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`);
    return end;
  }, 0);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: `conic-gradient(${parts.join(", ")})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 74,
            height: 74,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e" }}>
            {total}
          </div>
          <div style={{ fontSize: 10, color: "#aaa" }}>Total</div>
        </div>
      </div>
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
      >
        {segments.map((seg) => (
          <div
            key={seg.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: seg.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: "#555" }}>{seg.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{seg.value}</span>
              <span style={{ fontSize: 11, color: "#aaa" }}>
                {((seg.value / safeTotal) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reusable: System Alert Row ─────────────────────────────────────────────────
function SystemAlert({ icon, message, type }) {
  const colorMap = {
    warning: C.orange,
    error: C.red,
    info: C.blue,
    success: C.green,
  };
  const color = colorMap[type] || C.blue;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 10,
        background: color + "10",
        border: `1px solid ${color}30`,
        marginBottom: 10,
      }}
    >
      <span style={{ color, fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#444", flex: 1 }}>{message}</span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color,
          background: color + "18",
          borderRadius: 6,
          padding: "2px 8px",
        }}
      >
        {type.toUpperCase()}
      </span>
    </div>
  );
}

// ── Main AdminDashboard ────────────────────────────────────────────────────────
function AdminDashboard() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard.admin);
  const loading = useSelector((state) => state.dashboard.loading);
  const error = useSelector((state) => state.dashboard.error);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const stats = dashboard?.stats || {};
  const recentEvents = dashboard?.recentEvents || [];
  const recentUsers = dashboard?.recentUsers || [];

  // ── Derived KPIs
  const totalEvents = stats.totalEvents || 0;
  const totalBookings = stats.totalBookings || 0;
  const totalUsers = stats.totalUsers || 0;
  const totalRevenue = stats.totalRevenue || 0;

  const publishedEvents = stats.publishedEvents || 0;
  const draftEvents = stats.draftEvents || 0;
  const cancelledEvents = stats.cancelledEvents || 0;

  const paidBookings = stats.paidBookings || 0;
  const pendingBookings = stats.pendingBookings || 0;

  const successfulPayments = stats.successfulPayments || 0;
  const failedPayments = stats.failedPayments || 0;

  // ── Category breakdown from backend
  const categorySegments = useMemo(() => {
    const catBreakdown = dashboard?.categoryBreakdown || [];
    return catBreakdown.length > 0
      ? catBreakdown.map(({ _id, count }, i) => ({
          name: _id,
          value: count,
          color: CAT_COLORS[i % CAT_COLORS.length],
        }))
      : [
          { name: "Conference", value: 40, color: C.blue },
          { name: "Concert", value: 30, color: C.purple },
          { name: "Exhibition", value: 15, color: C.green },
          { name: "Workshop", value: 10, color: C.orange },
          { name: "Other", value: 5, color: C.cyan },
        ];
  }, [dashboard?.categoryBreakdown]);

  // ── Status donut
  const statusSegments = [
    { name: "Published", value: publishedEvents, color: C.blue },
    { name: "Draft", value: draftEvents, color: C.orange },
    { name: "Cancelled", value: cancelledEvents, color: C.red },
  ];

  // ── Booking status segments
  const bookingStatusSegments = [
    { name: "Paid", value: paidBookings, color: C.green },
    { name: "Pending", value: pendingBookings, color: C.gold },
    { name: "Failed", value: stats.failedBookings || 0, color: C.red },
  ];

  // ── Top events table data
  const tableData = useMemo(() => {
    return recentEvents
      .map((event, i) => ({
        key: i,
        name: event.title || event.name || "—",
        category: event.category?.name || event.category || "—",
        status: event.status || "—",
        organizer:
          event.organizer?.firstName + " " + event.organizer?.lastName || "—",
        bookings: 0, // This would need to be aggregated from backend
        revenue: 0, // This would need to be aggregated from backend
      }))
      .slice(0, 5);
  }, [recentEvents]);

  // ── Recent users table data
  const usersTableData = useMemo(() => {
    return recentUsers.slice(0, 5).map((u) => ({
      name: u.firstName + " " + u.lastName || "—",
      email: u.email || "—",
      role: u.role || "User",
      status: u.status || "Active",
      joined: new Date(u.createdAt).toLocaleDateString(),
    }));
  }, [recentUsers]);

  // ── Table columns: Top Events (simplified)
  const eventColumns = [
    {
      title: "#",
      key: "rank",
      width: 44,
      render: (_, __, i) => (
        <span style={{ fontWeight: 700, color: i < 3 ? C.gold : "#aaa" }}>
          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
        </span>
      ),
    },
    {
      title: "Event",
      dataIndex: "name",
      key: "name",
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <Tag color="purple" style={{ fontSize: 11, marginTop: 2 }}>
            {r.category}
          </Tag>
        </div>
      ),
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
      render: (o) => <span style={{ fontSize: 13 }}>{o}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const sl = s?.toLowerCase();
        return (
          <Tag
            color={
              sl === "published"
                ? "blue"
                : sl === "draft"
                  ? "orange"
                  : sl === "cancelled"
                    ? "red"
                    : "default"
            }
          >
            {s}
          </Tag>
        );
      },
    },
  ];

  // ── Table columns: Users
  const userColumns = [
    {
      title: "User",
      key: "user",
      render: (_, r, i) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            size={34}
            style={{
              background: CAT_COLORS[i % CAT_COLORS.length] + "20",
              color: CAT_COLORS[i % CAT_COLORS.length],
              fontWeight: 700,
            }}
          >
            {r.name?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const rl = role?.toLowerCase();
        return (
          <Tag
            color={rl === "admin" ? "red" : "blue"}
            icon={rl === "admin" ? <CrownOutlined /> : <UserOutlined />}
            style={{ fontWeight: 600 }}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Badge
          status={s?.toLowerCase() === "active" ? "success" : "default"}
          text={<span style={{ fontSize: 13 }}>{s}</span>}
        />
      ),
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
      render: (v) => <span style={{ color: "#888", fontSize: 12 }}>{v}</span>,
    },
  ];

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
              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#1a1a2e",
                }}
              >
                Admin Dashboard
              </h1>
              <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
                Full platform overview — events, users, revenue, and system
                health.
              </p>
            </div>
          </div>

          {/* ── KPI Row */}
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
                title="Registered Users"
                value={totalUsers}
                icon={<UserOutlined />}
                color={C.orange}
              />
            </Col>
          </Row>

          {/* ── Secondary KPI Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {[
              {
                label: "Published Events",
                value: publishedEvents,
                icon: "📅",
                color: C.blue,
              },
              {
                label: "Draft Events",
                value: draftEvents,
                icon: "📝",
                color: C.orange,
              },
              {
                label: "Cancelled Events",
                value: cancelledEvents,
                icon: "❌",
                color: C.red,
              },
              {
                label: "Paid Bookings",
                value: paidBookings,
                icon: "✅",
                color: C.green,
              },
              {
                label: "Pending Bookings",
                value: pendingBookings,
                icon: "⏳",
                color: C.gold,
              },
              {
                label: "Successful Payments",
                value: successfulPayments,
                icon: "💰",
                color: C.cyan,
              },
            ].map((m) => (
              <Col key={m.label} xs={12} sm={8} md={4}>
                <Card
                  style={{
                    borderRadius: 14,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    textAlign: "center",
                    border: `1px solid ${m.color}22`,
                  }}
                >
                  <div style={{ fontSize: 26 }}>{m.icon}</div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: m.color,
                      margin: "6px 0 4px",
                    }}
                  >
                    {m.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>{m.label}</div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* ── Category Breakdown */}
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
                  icon={<PieChartOutlined />}
                  title="Events by Category"
                  subtitle="Distribution"
                />
                {categorySegments.length === 0 ? (
                  <Empty description="No data" />
                ) : (
                  <DonutChart segments={categorySegments} />
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
                  icon={<FireOutlined />}
                  title="Event Status"
                  subtitle="Current breakdown"
                />
                {statusSegments.length === 0 ? (
                  <Empty description="No data" />
                ) : (
                  <DonutChart segments={statusSegments} />
                )}
              </Card>
            </Col>
          </Row>

          {/* ── Booking Status */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <SectionHeader
                  icon={<TrophyOutlined />}
                  title="Booking Status"
                  subtitle="Payment distribution"
                />
                {bookingStatusSegments.length === 0 ? (
                  <Empty description="No data" />
                ) : (
                  <DonutChart segments={bookingStatusSegments} />
                )}
              </Card>
            </Col>
          </Row>

          {/* ── Recent Events + Users Tables */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <SectionHeader
                  icon={<CalendarOutlined />}
                  title="Recent Events"
                  subtitle="Latest 5 events"
                />
                {tableData.length === 0 ? (
                  <Empty description="No events" />
                ) : (
                  <Table
                    columns={eventColumns}
                    dataSource={tableData}
                    pagination={false}
                    size="small"
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: 14,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <SectionHeader
                  icon={<UserOutlined />}
                  title="Recent Users"
                  subtitle="Latest 5 registrations"
                />
                {usersTableData.length === 0 ? (
                  <Empty description="No users" />
                ) : (
                  <Table
                    columns={userColumns}
                    dataSource={usersTableData}
                    pagination={false}
                    size="small"
                  />
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
