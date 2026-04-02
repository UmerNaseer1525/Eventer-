import {
  FileTextOutlined,
  DownloadOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  FilterOutlined,
  PrinterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarChartOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Select,
  Tag,
  Table,
  Progress,
  Statistic,
  Typography,
  Button,
  DatePicker,
  Divider,
  Badge,
  Alert,
} from "antd";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

const { Option } = Select;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// ── Colors ────────────────────────────────────────────────────────────────────
const C = {
  blue: "#1677ff",
  green: "#52c41a",
  orange: "#fa8c16",
  red: "#f5222d",
  purple: "#722ed1",
  cyan: "#13c2c2",
  gold: "#faad14",
};

// ── Static monthly report data ────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: "Jan", revenue: 4200,  bookings: 38,  events: 5,  cancelled: 1 },
  { month: "Feb", revenue: 5800,  bookings: 52,  events: 7,  cancelled: 0 },
  { month: "Mar", revenue: 4900,  bookings: 44,  events: 6,  cancelled: 1 },
  { month: "Apr", revenue: 7200,  bookings: 63,  events: 9,  cancelled: 2 },
  { month: "May", revenue: 6100,  bookings: 55,  events: 8,  cancelled: 0 },
  { month: "Jun", revenue: 8900,  bookings: 78,  events: 11, cancelled: 1 },
  { month: "Jul", revenue: 7500,  bookings: 67,  events: 10, cancelled: 1 },
  { month: "Aug", revenue: 9800,  bookings: 89,  events: 13, cancelled: 2 },
  { month: "Sep", revenue: 8300,  bookings: 74,  events: 11, cancelled: 0 },
  { month: "Oct", revenue: 11200, bookings: 98,  events: 15, cancelled: 1 },
  { month: "Nov", revenue: 10100, bookings: 91,  events: 14, cancelled: 2 },
  { month: "Dec", revenue: 13500, bookings: 120, events: 18, cancelled: 1 },
];

const CATEGORY_REPORT = [
  { category: "Conference", events: 12, bookings: 420, revenue: 21000, avgRating: 4.8 },
  { category: "Concert",    events: 9,  bookings: 380, revenue: 19000, avgRating: 4.6 },
  { category: "Meetup",     events: 15, bookings: 210, revenue: 6300,  avgRating: 4.3 },
  { category: "Exhibition", events: 6,  bookings: 145, revenue: 4350,  avgRating: 4.5 },
  { category: "Workshop",   events: 8,  bookings: 195, revenue: 5850,  avgRating: 4.7 },
];

// ── Reusable Components ───────────────────────────────────────────────────────
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
              <Text style={{ fontSize: 12, color: "#aaa" }}>vs last period</Text>
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

function BarChartAnt({ data, dataKey, color, maxValue }) {
  const max = maxValue || Math.max(...data.map((d) => d[dataKey]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, paddingBottom: 24, position: "relative" }}>
      {data.map((d, i) => {
        const pct = Math.round((d[dataKey] / max) * 100);
        return (
          <div
            key={i}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}
          >
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

// ── Main Reports Component ────────────────────────────────────────────────────
function Reports() {
  const [reportType, setReportType] = useState("monthly");
  const [exportFormat, setExportFormat] = useState("pdf");
  const events = useSelector((state) => state.event);

  const validEvents = Array.isArray(events)
    ? events.filter(
        (e) =>
          e &&
          typeof e.title === "string" &&
          typeof e.status === "string"
      )
    : [];

  const totalEvents    = validEvents.length || MONTHLY_DATA.reduce((s, d) => s + d.events, 0);
  const totalBookings  = MONTHLY_DATA.reduce((s, d) => s + d.bookings, 0);
  const totalRevenue   = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalCancelled = MONTHLY_DATA.reduce((s, d) => s + d.cancelled, 0);

  const upcomingCount  = validEvents.filter((e) => e.status.toLowerCase() === "upcoming").length;
  const ongoingCount   = validEvents.filter((e) => e.status.toLowerCase() === "ongoing").length;
  const completedCount = validEvents.filter((e) => e.status.toLowerCase() === "completed").length;
  const cancelledCount = validEvents.filter((e) => e.status.toLowerCase() === "cancelled").length;

  const displayData = reportType === "monthly" ? MONTHLY_DATA : MONTHLY_DATA.slice(0, 7);

  // Category table columns
  const categoryColumns = [
    {
      title: "#",
      key: "index",
      render: (_, __, i) => (
        <span style={{ fontWeight: 700, color: C.blue }}>{i + 1}</span>
      ),
      width: 48,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (v) => (
        <Tag color="purple" style={{ fontWeight: 600, borderRadius: 6, fontSize: 13 }}>
          {v}
        </Tag>
      ),
    },
    {
      title: "Events",
      dataIndex: "events",
      key: "events",
      sorter: (a, b) => a.events - b.events,
      render: (v) => <span style={{ fontWeight: 700 }}>{v}</span>,
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
      sorter: (a, b) => a.bookings - b.bookings,
      render: (v) => <span style={{ fontWeight: 700, color: C.blue }}>{v}</span>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v) => <span style={{ fontWeight: 700, color: C.green }}>${v.toLocaleString()}</span>,
    },
    {
      title: "Avg. Rating",
      dataIndex: "avgRating",
      key: "avgRating",
      render: (v) => (
        <span style={{ fontWeight: 700, color: C.gold }}>⭐ {v}</span>
      ),
    },
    {
      title: "Share",
      key: "share",
      render: (_, r) => {
        const totalRev = CATEGORY_REPORT.reduce((s, c) => s + c.revenue, 0);
        const pct = Math.round((r.revenue / totalRev) * 100);
        return (
          <div style={{ minWidth: 100 }}>
            <Progress
              percent={pct}
              size="small"
              strokeColor={C.purple}
              showInfo={false}
            />
            <span style={{ fontSize: 11, color: "#888" }}>{pct}% of total</span>
          </div>
        );
      },
    },
  ];

  // Monthly summary table columns
  const monthlyColumns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (v) => <span style={{ fontWeight: 600 }}>{v}</span>,
    },
    {
      title: "Events",
      dataIndex: "events",
      key: "events",
      render: (v) => <span style={{ fontWeight: 700, color: C.blue }}>{v}</span>,
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
      render: (v) => <span style={{ fontWeight: 700, color: C.purple }}>{v}</span>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (v) => <span style={{ fontWeight: 700, color: C.green }}>${v.toLocaleString()}</span>,
    },
    {
      title: "Cancelled",
      dataIndex: "cancelled",
      key: "cancelled",
      render: (v) => (
        <Tag color={v > 1 ? "red" : v === 1 ? "orange" : "green"} style={{ borderRadius: 6 }}>
          {v > 0 ? v : "None"}
        </Tag>
      ),
    },
    {
      title: "Revenue vs Target",
      key: "target",
      render: (_, r) => {
        const pct = Math.min(100, Math.round((r.revenue / 15000) * 100));
        return (
          <div style={{ minWidth: 120 }}>
            <Progress
              percent={pct}
              size="small"
              strokeColor={pct >= 100 ? C.green : pct >= 60 ? C.blue : C.gold}
              showInfo={false}
            />
            <span style={{ fontSize: 11, color: "#888" }}>{pct}% of $15k target</span>
          </div>
        );
      },
    },
  ];

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
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>
            Reports
          </h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
            Generate and export detailed reports for events, bookings, and revenue.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Select value={reportType} onChange={setReportType} size="large" style={{ width: 160 }}>
            <Option value="monthly">Monthly Report</Option>
            <Option value="weekly">Weekly Report</Option>
          </Select>
          <Select value={exportFormat} onChange={setExportFormat} size="large" style={{ width: 120 }}>
            <Option value="pdf">PDF</Option>
            <Option value="csv">CSV</Option>
            <Option value="xlsx">Excel</Option>
          </Select>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            style={{ borderRadius: 8, background: C.blue }}
          >
            Export
          </Button>
          <Button
            icon={<PrinterOutlined />}
            size="large"
            style={{ borderRadius: 8 }}
          >
            Print
          </Button>
        </div>
      </div>

      <Alert
        message="Reports are generated based on your current event and booking data."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: 10 }}
      />

      {/* ── KPI Summary */}
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
            title="Cancellations"
            value={totalCancelled}
            icon={<CloseCircleOutlined />}
            color={C.red}
            change={-5.2}
          />
        </Col>
      </Row>

      {/* ── Status Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: "Upcoming Events",  value: upcomingCount  || 2, icon: "📅", color: C.blue   },
          { label: "Ongoing Events",   value: ongoingCount   || 1, icon: "🔴", color: C.orange },
          { label: "Completed Events", value: completedCount || 2, icon: "✅", color: C.green  },
          { label: "Cancelled Events", value: cancelledCount || 1, icon: "❌", color: C.red    },
        ].map((m) => (
          <Col key={m.label} xs={12} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                textAlign: "center",
                border: `1px solid ${m.color}22`,
              }}
            >
              <div style={{ fontSize: 30 }}>{m.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: m.color, margin: "6px 0 4px" }}>
                {m.value}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>{m.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Revenue Bar Chart + Quick Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <SectionHeader
              icon={<BarChartOutlined />}
              title="Revenue Overview"
              subtitle={reportType === "monthly" ? "Monthly revenue (this year)" : "Daily revenue (this week)"}
            />
            <BarChartAnt
              data={displayData}
              dataKey="revenue"
              color={C.blue}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", height: "100%" }}>
            <SectionHeader
              icon={<RiseOutlined />}
              title="Key Metrics"
              subtitle="Derived from report period"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  label: "Avg. Revenue / Month",
                  value: `$${Math.round(totalRevenue / 12).toLocaleString()}`,
                  color: C.green,
                  pct: 72,
                },
                {
                  label: "Avg. Bookings / Month",
                  value: Math.round(totalBookings / 12),
                  color: C.blue,
                  pct: 65,
                },
                {
                  label: "Cancellation Rate",
                  value: `${Math.round((totalCancelled / totalEvents) * 100)}%`,
                  color: C.red,
                  pct: Math.round((totalCancelled / totalEvents) * 100),
                },
                {
                  label: "Booking Conversion",
                  value: "78%",
                  color: C.purple,
                  pct: 78,
                },
              ].map((m) => (
                <div key={m.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: "#555" }}>{m.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</span>
                  </div>
                  <Progress
                    percent={m.pct}
                    showInfo={false}
                    strokeColor={m.color}
                    trailColor="#f5f5f5"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ── Category Breakdown Table */}
      <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
          <SectionHeader
            icon={<PieChartOutlined />}
            title="Report by Category"
            subtitle="Breakdown of events, bookings, and revenue per category"
          />
          <Button icon={<DownloadOutlined />} size="small" style={{ borderRadius: 6 }}>
            Export Table
          </Button>
        </div>
        <Table
          dataSource={CATEGORY_REPORT}
          columns={categoryColumns}
          rowKey="category"
          pagination={false}
          size="middle"
          scroll={{ x: 600 }}
        />
      </Card>

      {/* ── Monthly Summary Table */}
      <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
          <SectionHeader
            icon={<FileTextOutlined />}
            title="Monthly Summary"
            subtitle="Full breakdown of events and revenue by month"
          />
          <Button icon={<DownloadOutlined />} size="small" style={{ borderRadius: 6 }}>
            Export Table
          </Button>
        </div>
        <Table
          dataSource={MONTHLY_DATA}
          columns={monthlyColumns}
          rowKey="month"
          pagination={{ pageSize: 6, size: "small" }}
          size="middle"
          scroll={{ x: 600 }}
        />
      </Card>

    </div>
  );
}

export default Reports;