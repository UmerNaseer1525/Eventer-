import {
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  FireOutlined,
  TrophyOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Select,
  Tag,
  Table,
  Progress,
  Badge,
  Divider,
  Statistic,
} from "antd";
import { useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useMemo } from "react";

const { Option } = Select;

// ─── Color Palette ─────────────────────────────────────────────────────────────
const COLORS = {
  blue: "#1677ff",
  green: "#52c41a",
  orange: "#fa8c16",
  red: "#f5222d",
  purple: "#722ed1",
  cyan: "#13c2c2",
  gold: "#faad14",
  pink: "#eb2f96",
};

const PIE_COLORS = [
  COLORS.blue,
  COLORS.purple,
  COLORS.green,
  COLORS.orange,
  COLORS.cyan,
  COLORS.pink,
];

// ─── Static / Fallback Chart Data ─────────────────────────────────────────────
const monthlyRevenueData = [
  { month: "Jan", revenue: 4200, bookings: 38, events: 5 },
  { month: "Feb", revenue: 5800, bookings: 52, events: 7 },
  { month: "Mar", revenue: 4900, bookings: 44, events: 6 },
  { month: "Apr", revenue: 7200, bookings: 63, events: 9 },
  { month: "May", revenue: 6100, bookings: 55, events: 8 },
  { month: "Jun", revenue: 8900, bookings: 78, events: 11 },
  { month: "Jul", revenue: 7500, bookings: 67, events: 10 },
  { month: "Aug", revenue: 9800, bookings: 89, events: 13 },
  { month: "Sep", revenue: 8300, bookings: 74, events: 11 },
  { month: "Oct", revenue: 11200, bookings: 98, events: 15 },
  { month: "Nov", revenue: 10100, bookings: 91, events: 14 },
  { month: "Dec", revenue: 13500, bookings: 120, events: 18 },
];

const weeklyData = [
  { day: "Mon", revenue: 1200, bookings: 11 },
  { day: "Tue", revenue: 1900, bookings: 17 },
  { day: "Wed", revenue: 1500, bookings: 13 },
  { day: "Thu", revenue: 2200, bookings: 20 },
  { day: "Fri", revenue: 3100, bookings: 28 },
  { day: "Sat", revenue: 4200, bookings: 38 },
  { day: "Sun", revenue: 2800, bookings: 25 },
];

const topEventsData = [
  { name: "Tech Conference 2026", bookings: 142, revenue: 7100, category: "Conference", status: "Upcoming" },
  { name: "Music Festival",       bookings: 310, revenue: 15500, category: "Concert",    status: "Ongoing"  },
  { name: "Art & Design Expo",    bookings: 89,  revenue: 2670,  category: "Exhibition", status: "Completed"},
  { name: "Startup Summit",       bookings: 201, revenue: 10050, category: "Conference", status: "Upcoming" },
  { name: "Jazz Night",           bookings: 75,  revenue: 3675,  category: "Concert",    status: "Upcoming" },
];

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
          borderRadius: 10,
          padding: "10px 16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          fontSize: 13,
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 6, color: "#333" }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: <strong>{p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, prefix, suffix, icon, color, change, changeLabel }) {
  const isPositive = change >= 0;
  return (
    <Card
      style={{
        borderRadius: 14,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        borderTop: `4px solid ${color}`,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 6, fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", lineHeight: 1.1 }}>
            {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
          </div>
          {change !== undefined && (
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
              {isPositive
                ? <ArrowUpOutlined style={{ color: COLORS.green, fontSize: 12 }} />
                : <ArrowDownOutlined style={{ color: COLORS.red, fontSize: 12 }} />
              }
              <span style={{ fontSize: 12, color: isPositive ? COLORS.green : COLORS.red, fontWeight: 600 }}>
                {Math.abs(change)}%
              </span>
              <span style={{ fontSize: 12, color: "#aaa" }}>{changeLabel || "vs last month"}</span>
            </div>
          )}
        </div>
        <div style={{
          width: 50, height: 50, borderRadius: 12,
          background: color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color,
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18, color: COLORS.blue }}>{icon}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>{title}</span>
      </div>
      {subtitle && <div style={{ fontSize: 12, color: "#aaa", marginTop: 2, marginLeft: 26 }}>{subtitle}</div>}
    </div>
  );
}

// ─── Main Analytics Page ───────────────────────────────────────────────────────
function Analytics() {
  const [period, setPeriod] = useState("monthly");

  // Pull from Redux
  const allEvents   = useSelector((state) => state.event);
  const allBookings = useSelector((state) => state.booking);

  // ── Derive stats from Redux data
  const events   = Array.isArray(allEvents)   ? allEvents   : [];
  const bookings = Array.isArray(allBookings) ? allBookings : [];

  const totalEvents    = events.length;
  const totalBookings  = bookings.length;
  const totalRevenue   = events.reduce((s, e) => s + (e.revenue || 0), 0) || 45320;
  const upcomingEvents = events.filter((e) => e.status?.toLowerCase() === "upcoming").length;
  const ongoingEvents  = events.filter((e) => e.status?.toLowerCase() === "ongoing").length;
  const completedEvents= events.filter((e) => e.status?.toLowerCase() === "completed").length;
  const cancelledEvents= events.filter((e) => e.status?.toLowerCase() === "cancelled").length;

  // ── Category breakdown for Pie chart
  const categoryMap = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (e.category) map[e.category] = (map[e.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [events]);

  const pieData = categoryMap.length > 0
    ? categoryMap
    : [
        { name: "Conference", value: 40 },
        { name: "Concert",    value: 30 },
        { name: "Exhibition", value: 15 },
        { name: "Workshop",   value: 10 },
        { name: "Other",      value: 5  },
      ];

  // ── Status breakdown for bar chart
  const statusData = [
    { status: "Upcoming",  count: upcomingEvents  || 58 },
    { status: "Ongoing",   count: ongoingEvents   || 14 },
    { status: "Completed", count: completedEvents || 43 },
    { status: "Cancelled", count: cancelledEvents || 10 },
  ];

  const chartData = period === "weekly" ? weeklyData : monthlyRevenueData;

  // ── Top Events Table columns
  const columns = [
    {
      title: "#",
      key: "rank",
      width: 40,
      render: (_, __, i) => (
        <span style={{ fontWeight: 700, color: i < 3 ? COLORS.gold : "#aaa" }}>
          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
        </span>
      ),
    },
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
          <Tag color="purple" style={{ fontSize: 11, marginTop: 2 }}>{record.category}</Tag>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "Upcoming" ? "blue" : s === "Ongoing" ? "green" : s === "Cancelled" ? "red" : "default"}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
      sorter: (a, b) => a.bookings - b.bookings,
      render: (v) => <span style={{ fontWeight: 700, color: COLORS.blue }}>{v}</span>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v) => <span style={{ fontWeight: 700, color: COLORS.green }}>${v.toLocaleString()}</span>,
    },
    {
      title: "Fill Rate",
      key: "fill",
      render: (_, record) => {
        const pct = Math.min(100, Math.round((record.bookings / 350) * 100));
        return (
          <div style={{ minWidth: 100 }}>
            <Progress
              percent={pct}
              size="small"
              strokeColor={pct > 70 ? COLORS.green : pct > 40 ? COLORS.gold : COLORS.orange}
              showInfo={false}
            />
            <span style={{ fontSize: 11, color: "#888" }}>{pct}% full</span>
          </div>
        );
      },
    },
  ];

  // ── Use real events if available, otherwise fallback
  const tableData = events.length > 0
    ? events.slice(0, 5).map((e) => ({
        name: e.name,
        bookings: e.attendees || Math.floor(Math.random() * 200 + 50),
        revenue: e.revenue || 0,
        category: e.category || "—",
        status: e.status || "—",
      }))
    : topEventsData;

  return (
    <div style={{ padding: "10px" }}>
      {/* ── Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>Analytics</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
            Track performance, revenue, and event insights at a glance.
          </p>
        </div>
        <Select
          value={period}
          onChange={setPeriod}
          size="large"
          style={{ width: 160 }}
        >
          <Option value="weekly">This Week</Option>
          <Option value="monthly">This Year</Option>
        </Select>
      </div>

      {/* ── KPI Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Events"
            value={totalEvents || 125}
            icon={<CalendarOutlined />}
            color={COLORS.blue}
            change={12.5}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Bookings"
            value={totalBookings || 1893}
            icon={<TeamOutlined />}
            color={COLORS.purple}
            change={8.2}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
            prefix="$"
            icon={<DollarOutlined />}
            color={COLORS.green}
            change={23.5}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Growth Rate"
            value={23.5}
            suffix="%"
            icon={<RiseOutlined />}
            color={COLORS.orange}
            change={4.1}
          />
        </Col>
      </Row>

      {/* ── Revenue & Bookings Trend */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            style={{ borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
            styles={{ body: { paddingTop: 20 } }}
          >
            <SectionHeader
              icon={<LineChartOutlined />}
              title="Revenue & Bookings Trend"
              subtitle={period === "weekly" ? "Last 7 days" : "Last 12 months"}
            />
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.blue}   stopOpacity={0.18} />
                    <stop offset="95%" stopColor={COLORS.blue}   stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS.purple} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey={period === "weekly" ? "day" : "month"} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.blue}
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke={COLORS.purple}
                  strokeWidth={2.5}
                  fill="url(#bkGrad)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* ── Category Breakdown Pie */}
        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", height: "100%" }}
            styles={{ body: { paddingTop: 20 } }}
          >
            <SectionHeader
              icon={<PieChartOutlined />}
              title="Events by Category"
              subtitle="Distribution across types"
            />
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ marginTop: 8 }}>
              {pieData.map((item, i) => (
                <div
                  key={item.name}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span style={{ fontSize: 13, color: "#555" }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Status Bar Chart + Monthly Events Line */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Status Distribution */}
        <Col xs={24} md={12}>
          <Card
            style={{ borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
            styles={{ body: { paddingTop: 20 } }}
          >
            <SectionHeader
              icon={<BarChartOutlined />}
              title="Events by Status"
              subtitle="Current status distribution"
            />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.status === "Upcoming"  ? COLORS.blue   :
                        entry.status === "Ongoing"   ? COLORS.green  :
                        entry.status === "Completed" ? COLORS.cyan   :
                        COLORS.red
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Monthly Events Created Line */}
        <Col xs={24} md={12}>
          <Card
            style={{ borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
            styles={{ body: { paddingTop: 20 } }}
          >
            <SectionHeader
              icon={<LineChartOutlined />}
              title="Events Created per Month"
              subtitle="New events added over time"
            />
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke={COLORS.orange}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS.orange }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* ── Quick Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: "Avg. Bookings / Event", value: totalEvents ? Math.round((totalBookings || 1893) / (totalEvents || 125)) : 15, icon: "📊", color: COLORS.blue },
          { label: "Avg. Revenue / Event",  value: `$${totalEvents ? Math.round(totalRevenue / (totalEvents || 125)).toLocaleString() : "362"}`, icon: "💰", color: COLORS.green },
          { label: "Cancellation Rate",     value: `${totalEvents ? Math.round((cancelledEvents / totalEvents) * 100) : 8}%`, icon: "❌", color: COLORS.red },
          { label: "Completion Rate",       value: `${totalEvents ? Math.round(((completedEvents + ongoingEvents) / totalEvents) * 100) : 46}%`, icon: "✅", color: COLORS.cyan },
        ].map((m) => (
          <Col key={m.label} xs={12} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 14,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                textAlign: "center",
                border: `1px solid ${m.color}22`,
              }}
            >
              <div style={{ fontSize: 28 }}>{m.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color, margin: "6px 0 4px" }}>
                {m.value}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>{m.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Top Performing Events Table */}
      <Card
        style={{ borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
        styles={{ body: { paddingTop: 20 } }}
      >
        <SectionHeader
          icon={<TrophyOutlined />}
          title="Top Performing Events"
          subtitle="Ranked by bookings and revenue"
        />
        <Table
          dataSource={tableData}
          columns={columns}
          rowKey={(r, i) => r.name + i}
          pagination={false}
          size="middle"
          scroll={{ x: 600 }}
          rowClassName={(_, i) =>
            i === 0 ? "top-row" : ""
          }
        />
      </Card>
    </div>
  );
}

export default Analytics;