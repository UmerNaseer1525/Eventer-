import {
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FireOutlined,
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
  Statistic,
  Typography,
} from "antd";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

const { Option }    = Select;
const { Text }      = Typography;

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  blue:   "#1677ff",
  green:  "#52c41a",
  orange: "#fa8c16",
  red:    "#f5222d",
  purple: "#722ed1",
  cyan:   "#13c2c2",
  gold:   "#faad14",
};

// ── Monthly data ──────────────────────────────────────────────────────────────
const MONTHLY = [
  { month: "Jan", revenue: 4200,  bookings: 38,  events: 5  },
  { month: "Feb", revenue: 5800,  bookings: 52,  events: 7  },
  { month: "Mar", revenue: 4900,  bookings: 44,  events: 6  },
  { month: "Apr", revenue: 7200,  bookings: 63,  events: 9  },
  { month: "May", revenue: 6100,  bookings: 55,  events: 8  },
  { month: "Jun", revenue: 8900,  bookings: 78,  events: 11 },
  { month: "Jul", revenue: 7500,  bookings: 67,  events: 10 },
  { month: "Aug", revenue: 9800,  bookings: 89,  events: 13 },
  { month: "Sep", revenue: 8300,  bookings: 74,  events: 11 },
  { month: "Oct", revenue: 11200, bookings: 98,  events: 15 },
  { month: "Nov", revenue: 10100, bookings: 91,  events: 14 },
  { month: "Dec", revenue: 13500, bookings: 120, events: 18 },
];

const WEEKLY = [
  { month: "Mon", revenue: 1200, bookings: 11, events: 2 },
  { month: "Tue", revenue: 1900, bookings: 17, events: 3 },
  { month: "Wed", revenue: 1500, bookings: 13, events: 2 },
  { month: "Thu", revenue: 2200, bookings: 20, events: 4 },
  { month: "Fri", revenue: 3100, bookings: 28, events: 5 },
  { month: "Sat", revenue: 4200, bookings: 38, events: 6 },
  { month: "Sun", revenue: 2800, bookings: 25, events: 4 },
];

const TOP_EVENTS = [
  { name: "Tech Conference 2026", bookings: 142, revenue: 7100,  category: "Conference", status: "Upcoming"  },
  { name: "Music Festival",       bookings: 310, revenue: 15500, category: "Concert",    status: "Ongoing"   },
  { name: "Art & Design Expo",    bookings: 89,  revenue: 2670,  category: "Exhibition", status: "Completed" },
  { name: "Startup Summit",       bookings: 201, revenue: 10050, category: "Conference", status: "Upcoming"  },
  { name: "Jazz Night",           bookings: 75,  revenue: 3675,  category: "Concert",    status: "Upcoming"  },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, prefix, suffix, icon, color, change }) {
  const isUp = change >= 0;
  return (
    <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderTop: `4px solid ${color}`, height: "100%" }}>
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
        <div style={{ width: 50, height: 50, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.blue, fontSize: 16 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>{title}</span>
      </div>
      {subtitle && <div style={{ fontSize: 12, color: "#aaa", marginTop: 3, marginLeft: 26 }}>{subtitle}</div>}
    </div>
  );
}

// ── Bar Chart using CSS + Progress ────────────────────────────────────────────
function BarChartAnt({ data, dataKey, color, maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => d[dataKey]));
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

// ── Line Chart using CSS ──────────────────────────────────────────────────────
function LineChartAnt({ data, dataKey, color }) {
  const max    = Math.max(...data.map((d) => d[dataKey]));
  const min    = Math.min(...data.map((d) => d[dataKey]));
  const range  = max - min || 1;
  const H      = 130;
  const W_STEP = 100 / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * W_STEP,
    y: H - ((d[dataKey] - min) / range) * H,
    val: d[dataKey],
    label: d.month,
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
      {/* x-axis labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: 2, paddingRight: 2 }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: 10, color: "#aaa", flex: 1, textAlign: "center" }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}

// ── Donut Chart using CSS conic-gradient ──────────────────────────────────────
function DonutChart({ segments }) {
  const total  = segments.reduce((s, seg) => s + seg.value, 0);
  let   current = 0;
  const gradientParts = segments.map((seg) => {
    const pct   = (seg.value / total) * 100;
    const start = current;
    current    += pct;
    return `${seg.color} ${start.toFixed(1)}% ${current.toFixed(1)}%`;
  });
  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: 130, height: 130, borderRadius: "50%", background: gradient }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 74, height: 74, borderRadius: "50%",
          background: "#fff", display: "flex", alignItems: "center",
          justifyContent: "center", flexDirection: "column",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
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

// ── Main Page ─────────────────────────────────────────────────────────────────
function Analytics() {
  const [period, setPeriod] = useState("monthly");

  const allEvents   = useSelector((state) => state.event);
  const allBookings = useSelector((state) => state.booking);

  const events   = Array.isArray(allEvents)   ? allEvents   : [];
  const bookings = Array.isArray(allBookings) ? allBookings : [];

  const totalEvents     = events.length   || 125;
  const totalBookings   = bookings.length || 1893;
  const totalRevenue    = events.reduce((s, e) => s + (e.revenue || 0), 0) || 45320;
  const upcomingEvents  = events.filter((e) => e.status?.toLowerCase() === "upcoming").length  || 58;
  const ongoingEvents   = events.filter((e) => e.status?.toLowerCase() === "ongoing").length   || 14;
  const completedEvents = events.filter((e) => e.status?.toLowerCase() === "completed").length || 43;
  const cancelledEvents = events.filter((e) => e.status?.toLowerCase() === "cancelled").length || 10;

  // Category pie data
  const categoryMap = useMemo(() => {
    const map = {};
    events.forEach((e) => { if (e.category) map[e.category] = (map[e.category] || 0) + 1; });
    return Object.keys(map).length > 0
      ? Object.entries(map).map(([name, value], i) => ({ name, value, color: Object.values(C)[i % 6] }))
      : [
          { name: "Conference", value: 40, color: C.blue   },
          { name: "Concert",    value: 30, color: C.purple },
          { name: "Exhibition", value: 15, color: C.green  },
          { name: "Workshop",   value: 10, color: C.orange },
          { name: "Other",      value: 5,  color: C.cyan   },
        ];
  }, [events]);

  const statusSegments = [
    { name: "Upcoming",  value: upcomingEvents,  color: C.blue   },
    { name: "Ongoing",   value: ongoingEvents,   color: C.green  },
    { name: "Completed", value: completedEvents, color: C.cyan   },
    { name: "Cancelled", value: cancelledEvents, color: C.red    },
  ];

  const chartData = period === "weekly" ? WEEKLY : MONTHLY;

  // Top events table
  const tableData = events.length > 0
    ? events.slice(0, 5).map((e) => ({ name: e.name, bookings: e.attendees || 50, revenue: e.revenue || 0, category: e.category || "—", status: e.status || "—" }))
    : TOP_EVENTS;

  const maxRevenue  = Math.max(...chartData.map((d) => d.revenue));
  const maxBookings = Math.max(...chartData.map((d) => d.bookings));

  const columns = [
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
      render: (s) => (
        <Tag color={s === "Upcoming" ? "blue" : s === "Ongoing" ? "green" : s === "Cancelled" ? "red" : "default"}>{s}</Tag>
      ),
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

  return (
    <div style={{ padding: "10px" }}>

      {/* ── Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>Analytics</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>Track performance, revenue, and event insights.</p>
        </div>
        <Select value={period} onChange={setPeriod} size="large" style={{ width: 160 }}>
          <Option value="weekly">This Week</Option>
          <Option value="monthly">This Year</Option>
        </Select>
      </div>

      {/* ── KPI Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Total Events"    value={totalEvents}   icon={<CalendarOutlined />} color={C.blue}   change={12.5} />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Total Bookings"  value={totalBookings} icon={<TeamOutlined />}     color={C.purple} change={8.2}  />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Total Revenue"   value={totalRevenue}  prefix="$" icon={<DollarOutlined />} color={C.green} change={23.5} />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard title="Growth Rate"     value={23.5}          suffix="%" icon={<RiseOutlined />}   color={C.orange} change={4.1} />
        </Col>
      </Row>

      {/* ── Revenue Bar + Bookings Line */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader
              icon={<BarChartOutlined />}
              title="Revenue"
              subtitle={period === "weekly" ? "This week (daily)" : "This year (monthly)"}
            />
            <BarChartAnt data={chartData} dataKey="revenue" color={C.blue} maxValue={maxRevenue} />
          </Card>
        </Col>
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
      </Row>

      {/* ── Donut Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader icon={<PieChartOutlined />} title="Events by Category" subtitle="Distribution across types" />
            <DonutChart segments={categoryMap} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader icon={<PieChartOutlined />} title="Events by Status" subtitle="Current status breakdown" />
            <DonutChart segments={statusSegments} />
          </Card>
        </Col>
      </Row>

      {/* ── Quick Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: "Avg. Bookings / Event", value: Math.round(totalBookings / totalEvents),                           icon: "📊", color: C.blue   },
          { label: "Avg. Revenue / Event",  value: `$${Math.round(totalRevenue / totalEvents).toLocaleString()}`,     icon: "💰", color: C.green  },
          { label: "Cancellation Rate",     value: `${Math.round((cancelledEvents / totalEvents) * 100)}%`,           icon: "❌", color: C.red    },
          { label: "Completion Rate",       value: `${Math.round(((completedEvents + ongoingEvents) / totalEvents) * 100)}%`, icon: "✅", color: C.cyan },
        ].map((m) => (
          <Col key={m.label} xs={12} sm={12} md={6}>
            <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center", border: `1px solid ${m.color}22` }}>
              <div style={{ fontSize: 30 }}>{m.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: m.color, margin: "6px 0 4px" }}>{m.value}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{m.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Events progress bars */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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

        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader icon={<FireOutlined />} title="Revenue Progress" subtitle="Monthly revenue vs target ($15k)" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {chartData.map((d) => {
                const target = 15000;
                const pct    = Math.min(100, Math.round((d.revenue / target) * 100));
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
      </Row>

      {/* ── Top Events Table */}
      <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <SectionHeader icon={<TrophyOutlined />} title="Top Performing Events" subtitle="Ranked by bookings and revenue" />
        <Table
          dataSource={tableData}
          columns={columns}
          rowKey={(r, i) => r.name + i}
          pagination={false}
          size="middle"
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}

export default Analytics;