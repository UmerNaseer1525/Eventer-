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
  Select,
  Empty,
} from "antd";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

const { Option } = Select;
const { Text }   = Typography;

// ── Color Palette ──────────────────────────────────────────────────────────────
const C = {
  blue:   "#1677ff",
  green:  "#52c41a",
  orange: "#fa8c16",
  red:    "#f5222d",
  purple: "#722ed1",
  cyan:   "#13c2c2",
  gold:   "#faad14",
};
const CAT_COLORS = [C.blue, C.purple, C.orange, C.cyan, C.green, C.gold, C.red];

// ── Static chart data ──────────────────────────────────────────────────────────
const MONTHLY = [
  { month: "Jan", revenue: 4200,  bookings: 38,  events: 5,  users: 120 },
  { month: "Feb", revenue: 5800,  bookings: 52,  events: 7,  users: 145 },
  { month: "Mar", revenue: 4900,  bookings: 44,  events: 6,  users: 138 },
  { month: "Apr", revenue: 7200,  bookings: 63,  events: 9,  users: 172 },
  { month: "May", revenue: 6100,  bookings: 55,  events: 8,  users: 160 },
  { month: "Jun", revenue: 8900,  bookings: 78,  events: 11, users: 198 },
  { month: "Jul", revenue: 7500,  bookings: 67,  events: 10, users: 185 },
  { month: "Aug", revenue: 9800,  bookings: 89,  events: 13, users: 220 },
  { month: "Sep", revenue: 8300,  bookings: 74,  events: 11, users: 207 },
  { month: "Oct", revenue: 11200, bookings: 98,  events: 15, users: 254 },
  { month: "Nov", revenue: 10100, bookings: 91,  events: 14, users: 241 },
  { month: "Dec", revenue: 13500, bookings: 120, events: 18, users: 310 },
];

const WEEKLY = [
  { month: "Mon", revenue: 1200, bookings: 11, events: 2, users: 28 },
  { month: "Tue", revenue: 1900, bookings: 17, events: 3, users: 35 },
  { month: "Wed", revenue: 1500, bookings: 13, events: 2, users: 30 },
  { month: "Thu", revenue: 2200, bookings: 20, events: 4, users: 42 },
  { month: "Fri", revenue: 3100, bookings: 28, events: 5, users: 58 },
  { month: "Sat", revenue: 4200, bookings: 38, events: 6, users: 74 },
  { month: "Sun", revenue: 2800, bookings: 25, events: 4, users: 52 },
];

const SAMPLE_USERS = [
  { name: "Alice Johnson",  email: "alice@email.com",  role: "Admin",  status: "Active",   bookings: 14, joined: "Jan 2025" },
  { name: "Bob Smith",      email: "bob@email.com",    role: "User",   status: "Active",   bookings: 9,  joined: "Feb 2025" },
  { name: "Carol White",    email: "carol@email.com",  role: "User",   status: "Inactive", bookings: 3,  joined: "Mar 2025" },
  { name: "David Brown",    email: "david@email.com",  role: "User",   status: "Active",   bookings: 21, joined: "Jan 2025" },
  { name: "Eva Martinez",   email: "eva@email.com",    role: "Moderator", status: "Active", bookings: 7, joined: "Apr 2025" },
];

const SAMPLE_EVENTS = [
  { name: "Tech Conference 2026", bookings: 142, revenue: 7100,  category: "Conference", status: "Upcoming"  },
  { name: "Music Festival",       bookings: 310, revenue: 15500, category: "Concert",    status: "Ongoing"   },
  { name: "Art & Design Expo",    bookings: 89,  revenue: 2670,  category: "Exhibition", status: "Completed" },
  { name: "Startup Summit",       bookings: 201, revenue: 10050, category: "Conference", status: "Upcoming"  },
  { name: "Jazz Night",           bookings: 75,  revenue: 3675,  category: "Concert",    status: "Upcoming"  },
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8, fontWeight: 500 }}>{title}</div>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{ fontSize: 26, fontWeight: 900, color: "#1a1a2e" }}
          />
          {change !== undefined && (
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
              {isUp
                ? <ArrowUpOutlined style={{ color: C.green, fontSize: 12 }} />
                : <ArrowDownOutlined style={{ color: C.red, fontSize: 12 }} />}
              <Text style={{ fontSize: 12, color: isUp ? C.green : C.red, fontWeight: 600 }}>
                {Math.abs(change)}%
              </Text>
              <Text style={{ fontSize: 12, color: "#aaa" }}>vs last month</Text>
            </div>
          )}
        </div>
        <div
          style={{
            width: 50, height: 50, borderRadius: 12,
            background: color + "18",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color,
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
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>{title}</span>
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: "#aaa", marginTop: 3, marginLeft: 26 }}>{subtitle}</div>
      )}
    </div>
  );
}

// ── Reusable: Bar Chart ────────────────────────────────────────────────────────
function BarChartAnt({ data, dataKey, color }) {
  const max = Math.max(...data.map((d) => d[dataKey]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, paddingBottom: 24, position: "relative" }}>
      {data.map((d, i) => {
        const pct = Math.round((d[dataKey] / max) * 100);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
            <div style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>
              {d[dataKey] >= 1000 ? `${(d[dataKey] / 1000).toFixed(1)}k` : d[dataKey]}
            </div>
            <div
              style={{
                width: "100%", borderRadius: "4px 4px 0 0",
                height: `${pct}%`, minHeight: 4,
                background: `linear-gradient(to top, ${color}, ${color}99)`,
                transition: "height 0.3s ease",
                cursor: "pointer",
              }}
              title={`${d.month}: ${d[dataKey]}`}
            />
            <div style={{ fontSize: 10, color: "#aaa", position: "absolute", bottom: 0 }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Reusable: Line Chart ───────────────────────────────────────────────────────
function LineChartAnt({ data, dataKey, color }) {
  const max   = Math.max(...data.map((d) => d[dataKey]));
  const min   = Math.min(...data.map((d) => d[dataKey]));
  const range = max - min || 1;
  const H     = 130;
  const WSTEP = 100 / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * WSTEP,
    y: H - ((d[dataKey] - min) / range) * H,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H} L 0 ${H} Z`;

  return (
    <div style={{ position: "relative", height: H + 30, overflow: "hidden" }}>
      <svg width="100%" height={H + 4} viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
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
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: 2, paddingRight: 2 }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: 10, color: "#aaa", flex: 1, textAlign: "center" }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

// ── Reusable: Donut Chart ──────────────────────────────────────────────────────
function DonutChart({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let current = 0;
  const parts = segments.map((seg) => {
    const pct   = (seg.value / total) * 100;
    const start = current;
    current    += pct;
    return `${seg.color} ${start.toFixed(1)}% ${current.toFixed(1)}%`;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 130, height: 130, borderRadius: "50%",
            background: `conic-gradient(${parts.join(", ")})`,
          }}
        />
        <div
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 74, height: 74, borderRadius: "50%",
            background: "#fff", display: "flex", alignItems: "center",
            justifyContent: "center", flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e" }}>{total}</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>Total</div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((seg) => (
          <div key={seg.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#555" }}>{seg.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{seg.value}</span>
              <span style={{ fontSize: 11, color: "#aaa" }}>{((seg.value / total) * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reusable: System Alert Row ─────────────────────────────────────────────────
function SystemAlert({ icon, message, type }) {
  const colorMap = { warning: C.orange, error: C.red, info: C.blue, success: C.green };
  const color = colorMap[type] || C.blue;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderRadius: 10,
        background: color + "10",
        border: `1px solid ${color}30`,
        marginBottom: 10,
      }}
    >
      <span style={{ color, fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "#444", flex: 1 }}>{message}</span>
      <span
        style={{
          fontSize: 11, fontWeight: 600, color,
          background: color + "18", borderRadius: 6,
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
  const [period, setPeriod] = useState("monthly");

  const allEvents   = useSelector((state) => state.event);
  const allBookings = useSelector((state) => state.booking);
  const allUsers    = useSelector((state) => state.user);

  const events   = Array.isArray(allEvents)   ? allEvents   : [];
  const bookings = Array.isArray(allBookings) ? allBookings : [];
  const users    = Array.isArray(allUsers)    ? allUsers    : [];

  // ── Derived KPIs
  const totalEvents     = events.length    || 125;
  const totalBookings   = bookings.length  || 1893;
  const totalUsers      = users.length     || 3240;
  const totalRevenue    = events.reduce((s, e) => s + (e.revenue || 0), 0) || 45320;

  const upcomingCount   = events.filter((e) => e.status?.toLowerCase() === "upcoming").length   || 58;
  const ongoingCount    = events.filter((e) => e.status?.toLowerCase() === "ongoing").length    || 14;
  const completedCount  = events.filter((e) => e.status?.toLowerCase() === "completed").length  || 43;
  const cancelledCount  = events.filter((e) => e.status?.toLowerCase() === "cancelled").length  || 10;

  const activeUsers     = users.filter((u) => u.status?.toLowerCase() === "active").length   || 2810;
  const inactiveUsers   = users.filter((u) => u.status?.toLowerCase() === "inactive").length || 430;
  const adminUsers      = users.filter((u) => u.role?.toLowerCase() === "admin").length      || 12;

  const chartData = period === "weekly" ? WEEKLY : MONTHLY;

  // ── Category donut
  const categorySegments = useMemo(() => {
    const map = {};
    events.forEach((e) => { if (e.category) map[e.category] = (map[e.category] || 0) + 1; });
    return Object.keys(map).length > 0
      ? Object.entries(map).map(([name, value], i) => ({ name, value, color: CAT_COLORS[i % CAT_COLORS.length] }))
      : [
          { name: "Conference", value: 40, color: C.blue   },
          { name: "Concert",    value: 30, color: C.purple },
          { name: "Exhibition", value: 15, color: C.green  },
          { name: "Workshop",   value: 10, color: C.orange },
          { name: "Other",      value: 5,  color: C.cyan   },
        ];
  }, [events]);

  // ── Status donut
  const statusSegments = [
    { name: "Upcoming",  value: upcomingCount,  color: C.blue   },
    { name: "Ongoing",   value: ongoingCount,   color: C.green  },
    { name: "Completed", value: completedCount, color: C.cyan   },
    { name: "Cancelled", value: cancelledCount, color: C.red    },
  ];

  // ── User role donut
  const userRoleSegments = useMemo(() => {
    if (users.length === 0) {
      return [
        { name: "Users",      value: 3200, color: C.blue   },
        { name: "Admins",     value: 12,   color: C.purple },
        { name: "Moderators", value: 28,   color: C.orange },
      ];
    }
    const map = {};
    users.forEach((u) => { const r = u.role || "User"; map[r] = (map[r] || 0) + 1; });
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: CAT_COLORS[i % CAT_COLORS.length] }));
  }, [users]);

  // ── Top events table data
  const tableData = events.length > 0
    ? events.slice(0, 5).map((e) => ({
        name: e.title || e.name || "—",
        bookings: e.attendees || e.number_of_guests || 50,
        revenue:  e.revenue || 0,
        category: e.category || "—",
        status:   e.status   || "—",
      }))
    : SAMPLE_EVENTS;

  // ── Recent users table data
  const usersTableData = users.length > 0
    ? users.slice(0, 5).map((u) => ({
        name:     u.name || u.username || "—",
        email:    u.email || "—",
        role:     u.role  || "User",
        status:   u.status || "Active",
        bookings: u.bookings || 0,
        joined:   u.joined  || "—",
      }))
    : SAMPLE_USERS;

  // ── Table columns: Top Events
  const eventColumns = [
    {
      title: "#", key: "rank", width: 44,
      render: (_, __, i) => (
        <span style={{ fontWeight: 700, color: i < 3 ? C.gold : "#aaa" }}>
          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
        </span>
      ),
    },
    {
      title: "Event", dataIndex: "name", key: "name",
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <Tag color="purple" style={{ fontSize: 11, marginTop: 2 }}>{r.category}</Tag>
        </div>
      ),
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s) => {
        const sl = s?.toLowerCase();
        return (
          <Tag
            color={sl === "upcoming" ? "blue" : sl === "ongoing" ? "green" : sl === "cancelled" ? "red" : "default"}
            icon={
              sl === "upcoming"  ? <ClockCircleOutlined /> :
              sl === "ongoing"   ? <SyncOutlined spin />   :
              sl === "completed" ? <CheckCircleOutlined /> :
                                   <CloseCircleOutlined />
            }
          >
            {s}
          </Tag>
        );
      },
    },
    {
      title: "Bookings", dataIndex: "bookings", key: "bookings",
      sorter: (a, b) => a.bookings - b.bookings,
      render: (v) => <span style={{ fontWeight: 700, color: C.blue }}>{v}</span>,
    },
    {
      title: "Revenue", dataIndex: "revenue", key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v) => <span style={{ fontWeight: 700, color: C.green }}>${v.toLocaleString()}</span>,
    },
    {
      title: "Fill Rate", key: "fill",
      render: (_, r) => {
        const pct = Math.min(100, Math.round((r.bookings / 350) * 100));
        return (
          <div style={{ minWidth: 110 }}>
            <Progress percent={pct} size="small" strokeColor={pct > 70 ? C.green : pct > 40 ? C.gold : C.orange} showInfo={false} />
            <span style={{ fontSize: 11, color: "#888" }}>{pct}% full</span>
          </div>
        );
      },
    },
  ];

  // ── Table columns: Users
  const userColumns = [
    {
      title: "User", key: "user",
      render: (_, r, i) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            size={34}
            style={{ background: CAT_COLORS[i % CAT_COLORS.length] + "20", color: CAT_COLORS[i % CAT_COLORS.length], fontWeight: 700 }}
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
      title: "Role", dataIndex: "role", key: "role",
      render: (role) => {
        const rl = role?.toLowerCase();
        return (
          <Tag
            color={rl === "admin" ? "red" : rl === "moderator" ? "orange" : "blue"}
            icon={rl === "admin" ? <CrownOutlined /> : <UserOutlined />}
            style={{ fontWeight: 600 }}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s) => (
        <Badge
          status={s?.toLowerCase() === "active" ? "success" : "default"}
          text={<span style={{ fontSize: 13 }}>{s}</span>}
        />
      ),
    },
    {
      title: "Bookings", dataIndex: "bookings", key: "bookings",
      render: (v) => <span style={{ fontWeight: 700, color: C.purple }}>{v}</span>,
    },
    {
      title: "Joined", dataIndex: "joined", key: "joined",
      render: (v) => <span style={{ color: "#888", fontSize: 12 }}>{v}</span>,
    },
  ];

  return (
    <div style={{ padding: "10px" }}>

      {/* ── Header */}
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: 24,
          flexWrap: "wrap", gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>Admin Dashboard</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
            Full platform overview — events, users, revenue, and system health.
          </p>
        </div>
        <Select value={period} onChange={setPeriod} size="large" style={{ width: 160 }}>
          <Option value="weekly">This Week</Option>
          <Option value="monthly">This Year</Option>
        </Select>
      </div>

      {/* ── KPI Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Total Events"   value={totalEvents}   icon={<CalendarOutlined />} color={C.blue}   change={12.5} />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Total Bookings" value={totalBookings} icon={<TeamOutlined />}     color={C.purple} change={8.2}  />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Total Revenue"  value={totalRevenue}  prefix="$" icon={<DollarOutlined />} color={C.green} change={23.5} />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Registered Users" value={totalUsers} icon={<UserOutlined />} color={C.orange} change={6.8} />
        </Col>
      </Row>

      {/* ── Secondary KPI Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: "Active Users",     value: activeUsers,    icon: "🟢", color: C.green  },
          { label: "Inactive Users",   value: inactiveUsers,  icon: "⚫", color: "#aaa"   },
          { label: "Admin Users",      value: adminUsers,     icon: "👑", color: C.red    },
          { label: "Growth Rate",      value: "23.5%",        icon: "📈", color: C.blue   },
          { label: "Cancellation Rate",value: `${Math.round((cancelledCount / (totalEvents || 1)) * 100)}%`, icon: "❌", color: C.orange },
          { label: "Completion Rate",  value: `${Math.round(((completedCount + ongoingCount) / (totalEvents || 1)) * 100)}%`, icon: "✅", color: C.cyan },
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
              <div style={{ fontSize: 20, fontWeight: 900, color: m.color, margin: "6px 0 4px" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{m.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Revenue Bar + User Growth Line */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader
              icon={<BarChartOutlined />}
              title="Revenue"
              subtitle={period === "weekly" ? "This week (daily)" : "This year (monthly)"}
            />
            <BarChartAnt data={chartData} dataKey="revenue" color={C.blue} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader
              icon={<LineChartOutlined />}
              title="User Growth"
              subtitle={period === "weekly" ? "This week (daily)" : "This year (monthly)"}
            />
            <LineChartAnt data={chartData} dataKey="users" color={C.orange} />
          </Card>
        </Col>
      </Row>

      {/* ── Bookings Trend + Events Created */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader
              icon={<LineChartOutlined />}
              title="Bookings Trend"
              subtitle={period === "weekly" ? "This week (daily)" : "This year (monthly)"}
            />
            <LineChartAnt data={chartData} dataKey="bookings" color={C.purple} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader
              icon={<BarChartOutlined />}
              title="Events Created"
              subtitle={period === "weekly" ? "This week (daily)" : "This year (monthly)"}
            />
            <BarChartAnt data={chartData} dataKey="events" color={C.green} />
          </Card>
        </Col>
      </Row>

      {/* ── Donut Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", height: "100%" }}>
            <SectionHeader icon={<PieChartOutlined />} title="Events by Category" subtitle="Distribution across types" />
            <DonutChart segments={categorySegments} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", height: "100%" }}>
            <SectionHeader icon={<PieChartOutlined />} title="Events by Status" subtitle="Current status breakdown" />
            <DonutChart segments={statusSegments} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", height: "100%" }}>
            <SectionHeader icon={<PieChartOutlined />} title="Users by Role" subtitle="Platform role distribution" />
            <DonutChart segments={userRoleSegments} />
          </Card>
        </Col>
      </Row>

      {/* ── Revenue & Events Progress Bars */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader icon={<FireOutlined />} title="Revenue vs Target" subtitle="Monthly revenue vs target ($15k)" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {chartData.map((d) => {
                const pct = Math.min(100, Math.round((d.revenue / 15000) * 100));
                return (
                  <div key={d.month} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 32, fontSize: 12, color: "#888", flexShrink: 0 }}>{d.month}</span>
                    <Progress
                      percent={pct}
                      showInfo={false}
                      strokeColor={pct >= 100 ? C.green : pct >= 60 ? C.blue : C.gold}
                      trailColor="#f5f5f5"
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                    <span style={{ width: 44, fontSize: 12, fontWeight: 700, color: "#555", textAlign: "right" }}>
                      ${(d.revenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader icon={<BarChartOutlined />} title="Monthly Events Created" subtitle="New events added per month" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {chartData.map((d) => (
                <div key={d.month} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 32, fontSize: 12, color: "#888", flexShrink: 0 }}>{d.month}</span>
                  <Progress
                    percent={Math.round((d.events / Math.max(...chartData.map((x) => x.events))) * 100)}
                    showInfo={false}
                    strokeColor={C.orange}
                    trailColor="#f5f5f5"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <span style={{ width: 20, fontSize: 12, fontWeight: 700, color: C.orange }}>{d.events}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Top Events Table */}
      <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24 }}>
        <SectionHeader icon={<TrophyOutlined />} title="Top Performing Events" subtitle="Ranked by bookings and revenue" />
        <Table
          dataSource={tableData}
          columns={eventColumns}
          rowKey={(r, i) => r.name + i}
          pagination={false}
          size="middle"
          scroll={{ x: 700 }}
        />
      </Card>

      {/* ── Users Table + System Alerts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader icon={<UserOutlined />} title="Recent Users" subtitle="Latest registered platform users" />
            <Table
              dataSource={usersTableData}
              columns={userColumns}
              rowKey={(r, i) => r.email + i}
              pagination={false}
              size="middle"
              scroll={{ x: 500 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", height: "100%" }}>
            <SectionHeader icon={<AlertOutlined />} title="System Alerts" subtitle="Platform health & notices" />
            <SystemAlert
              icon={<CheckCircleOutlined />}
              message="All services are running normally."
              type="success"
            />
            <SystemAlert
              icon={<AlertOutlined />}
              message={`${cancelledCount} event(s) cancelled this period.`}
              type="warning"
            />
            <SystemAlert
              icon={<UserOutlined />}
              message={`${inactiveUsers} user account(s) are inactive.`}
              type="info"
            />
            <SystemAlert
              icon={<SettingOutlined />}
              message="Scheduled maintenance: Sunday 2:00 AM."
              type="info"
            />
            {cancelledCount > 10 && (
              <SystemAlert
                icon={<CloseCircleOutlined />}
                message="High cancellation rate detected. Review events."
                type="error"
              />
            )}

            {/* ── Platform Health Meters */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e", marginBottom: 14 }}>Platform Health</div>
              {[
                { label: "Uptime",       value: 99, color: C.green  },
                { label: "API Response", value: 87, color: C.blue   },
                { label: "DB Load",      value: 42, color: C.orange },
                { label: "Cache Hit",    value: 76, color: C.purple },
              ].map((m) => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 90, fontSize: 12, color: "#555", flexShrink: 0 }}>{m.label}</span>
                  <Progress
                    percent={m.value}
                    showInfo={false}
                    strokeColor={m.value > 70 ? C.green : m.value > 40 ? m.color : C.red}
                    trailColor="#f5f5f5"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <span style={{ width: 34, fontSize: 12, fontWeight: 700, color: "#555", textAlign: "right" }}>
                    {m.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
}

export default AdminDashboard;