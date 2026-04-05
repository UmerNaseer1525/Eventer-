import {
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  BarChartOutlined,
  PieChartOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Tag, Table, Progress, Alert, Empty } from "antd";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import InsightStatCard from "../../Components/Insights/InsightStatCard";
import InsightSectionHeader from "../../Components/Insights/InsightSectionHeader";
import InsightBarChart from "../../Components/Insights/InsightBarChart";
import { INSIGHT_COLORS as C } from "../../Components/Insights/theme";
import {
  buildTimelineData,
  toNumber,
} from "../../Components/Insights/insightUtils";
import {
  getApprovedEvents,
  getPaidApprovedBookings,
  getCompletedApprovedPayments,
  getTotalRevenue,
} from "../../utils/insightScope";

function Reports() {
  const events = useSelector((state) =>
    Array.isArray(state.event) ? state.event : [],
  );
  const bookings = useSelector((state) =>
    Array.isArray(state.booking) ? state.booking : [],
  );
  const payments = useSelector((state) =>
    Array.isArray(state.payment) ? state.payment : [],
  );

  const approvedEvents = useMemo(() => getApprovedEvents(events), [events]);

  const paidBookings = useMemo(
    () => getPaidApprovedBookings(bookings, approvedEvents),
    [bookings, approvedEvents],
  );

  const completedPayments = useMemo(
    () => getCompletedApprovedPayments(payments, approvedEvents),
    [payments, approvedEvents],
  );

  const displayData = useMemo(
    () =>
      buildTimelineData({
        period: "monthly",
        events: approvedEvents,
        bookings: paidBookings,
        payments: completedPayments,
      }),
    [approvedEvents, paidBookings, completedPayments],
  );

  const totalEvents = approvedEvents.length;
  const totalBookings = paidBookings.length;

  const totalRevenue = useMemo(
    () => getTotalRevenue(completedPayments, paidBookings),
    [completedPayments, paidBookings],
  );

  const totalCancelled = bookings.filter(
    (item) => String(item?.status ?? "").toLowerCase() === "cancelled",
  ).length;

  const statusCounts = {
    upcoming: approvedEvents.filter(
      (item) => String(item?.status ?? "").toLowerCase() === "upcoming",
    ).length,
    ongoing: approvedEvents.filter(
      (item) => String(item?.status ?? "").toLowerCase() === "ongoing",
    ).length,
    completed: approvedEvents.filter(
      (item) => String(item?.status ?? "").toLowerCase() === "completed",
    ).length,
    cancelled: approvedEvents.filter(
      (item) => String(item?.status ?? "").toLowerCase() === "cancelled",
    ).length,
  };

  const categoryData = useMemo(() => {
    const bookingByEvent = new Map();
    paidBookings.forEach((item) => {
      const key = String(item.eventId ?? item.title ?? item.name ?? "");
      if (!key) return;
      bookingByEvent.set(key, (bookingByEvent.get(key) || 0) + 1);
    });

    const revenueByEvent = new Map();
    completedPayments.forEach((item) => {
      const key = String(item.eventId ?? item.eventName ?? "");
      if (!key) return;
      revenueByEvent.set(
        key,
        (revenueByEvent.get(key) || 0) + toNumber(item.amount),
      );
    });

    const categoryMap = new Map();
    approvedEvents.forEach((event) => {
      const category = event.category || "Uncategorized";
      const eventId = String(event.id ?? "");
      const eventName = String(event.title ?? event.name ?? "");
      const current = categoryMap.get(category) || {
        category,
        events: 0,
        bookings: 0,
        revenue: 0,
      };

      current.events += 1;
      current.bookings +=
        (bookingByEvent.get(eventId) || 0) +
        (bookingByEvent.get(eventName) || 0);
      current.revenue +=
        (revenueByEvent.get(eventId) || 0) +
        (revenueByEvent.get(eventName) || 0);
      categoryMap.set(category, current);
    });

    return Array.from(categoryMap.values()).map((row) => ({
      ...row,
      avgRating:
        row.events > 0
          ? Number(
              (4 + Math.min(1, row.bookings / (row.events * 50))).toFixed(1),
            )
          : 0,
    }));
  }, [approvedEvents, paidBookings, completedPayments]);

  const categoryColumns = [
    {
      title: "#",
      key: "index",
      width: 48,
      render: (_, __, index) => (
        <span style={{ fontWeight: 700, color: C.blue }}>{index + 1}</span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (value) => (
        <Tag
          color="purple"
          style={{ fontWeight: 600, borderRadius: 6, fontSize: 13 }}
        >
          {value}
        </Tag>
      ),
    },
    {
      title: "Events",
      dataIndex: "events",
      key: "events",
      sorter: (a, b) => a.events - b.events,
      render: (value) => <span style={{ fontWeight: 700 }}>{value}</span>,
    },
    {
      title: "Bookings",
      dataIndex: "bookings",
      key: "bookings",
      sorter: (a, b) => a.bookings - b.bookings,
      render: (value) => (
        <span style={{ fontWeight: 700, color: C.blue }}>{value}</span>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value) => (
        <span style={{ fontWeight: 700, color: C.green }}>
          ${value.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Avg. Rating",
      dataIndex: "avgRating",
      key: "avgRating",
      render: (value) => (
        <span style={{ fontWeight: 700, color: C.gold }}>⭐ {value}</span>
      ),
    },
    {
      title: "Share",
      key: "share",
      render: (_, row) => {
        const totalCategoryRevenue = categoryData.reduce(
          (sum, item) => sum + item.revenue,
          0,
        );
        const pct =
          totalCategoryRevenue > 0
            ? Math.round((row.revenue / totalCategoryRevenue) * 100)
            : 0;

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

  const periodLabel = "Monthly";

  return (
    <div style={{ padding: "10px" }}>
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
            Reports
          </h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
            Slice-powered dummy report data for frontend submission.
          </p>
        </div>
      </div>

      <Alert
        message="Reports are generated from Redux slices (dummy data mode)."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24, borderRadius: 10 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Total Events"
            value={totalEvents}
            icon={<CalendarOutlined />}
            color={C.blue}
            change={12}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Total Bookings"
            value={totalBookings}
            icon={<TeamOutlined />}
            color={C.purple}
            change={8}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Total Revenue"
            value={totalRevenue}
            prefix="$"
            icon={<DollarOutlined />}
            color={C.green}
            change={24}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Cancellations"
            value={totalCancelled}
            icon={<CloseCircleOutlined />}
            color={C.red}
            change={-5}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          {
            label: "Upcoming Events",
            value: statusCounts.upcoming,
            icon: "📅",
            color: C.blue,
          },
          {
            label: "Ongoing Events",
            value: statusCounts.ongoing,
            icon: "🔴",
            color: C.orange,
          },
          {
            label: "Completed Events",
            value: statusCounts.completed,
            icon: "✅",
            color: C.green,
          },
          {
            label: "Cancelled Events",
            value: statusCounts.cancelled,
            icon: "❌",
            color: C.red,
          },
        ].map((item) => (
          <Col key={item.label} xs={12} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                textAlign: "center",
                border: `1px solid ${item.color}22`,
              }}
            >
              <div style={{ fontSize: 30 }}>{item.icon}</div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: item.color,
                  margin: "6px 0 4px",
                }}
              >
                {item.value}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>{item.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <InsightSectionHeader
              icon={<BarChartOutlined />}
              title="Revenue Overview"
              subtitle={`${periodLabel} revenue distribution`}
            />
            <InsightBarChart
              data={displayData}
              dataKey="revenue"
              color={C.blue}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              height: "100%",
            }}
          >
            <InsightSectionHeader
              icon={<RiseOutlined />}
              title="Key Metrics"
              subtitle={`${periodLabel} summary`}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  label: "Avg. Revenue / Period",
                  value: `$${Math.round(totalRevenue / 12).toLocaleString()}`,
                  color: C.green,
                  pct: 72,
                },
                {
                  label: "Avg. Bookings / Period",
                  value: Math.round(totalBookings / 12),
                  color: C.blue,
                  pct: 65,
                },
                {
                  label: "Cancellation Rate",
                  value:
                    totalBookings > 0
                      ? `${Math.round((totalCancelled / totalBookings) * 100)}%`
                      : "0%",
                  color: C.red,
                  pct:
                    totalBookings > 0
                      ? Math.round((totalCancelled / totalBookings) * 100)
                      : 0,
                },
                {
                  label: "Booking Conversion",
                  value:
                    totalEvents > 0
                      ? `${Math.round((totalBookings / totalEvents) * 100)}%`
                      : "0%",
                  color: C.purple,
                  pct:
                    totalEvents > 0
                      ? Math.min(
                          100,
                          Math.round((totalBookings / totalEvents) * 100),
                        )
                      : 0,
                },
              ].map((item) => (
                <div key={item.label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#555" }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: item.color,
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                  <Progress
                    percent={item.pct}
                    showInfo={false}
                    strokeColor={item.color}
                    trailColor="#f5f5f5"
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <InsightSectionHeader
            icon={<PieChartOutlined />}
            title="Report by Category"
            subtitle="Event, booking, and revenue totals"
          />
        </div>

        {categoryData.length === 0 ? (
          <Empty description="No category data available" />
        ) : (
          <Table
            dataSource={categoryData}
            columns={categoryColumns}
            rowKey="category"
            pagination={false}
            size="middle"
            scroll={{ x: 600 }}
          />
        )}
      </Card>

      <Card
        style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <InsightSectionHeader
            icon={<FileTextOutlined />}
            title={`${periodLabel} Summary`}
            subtitle="Events, bookings, revenue, and cancellations"
          />
        </div>
        <Table
          dataSource={displayData}
          columns={[
            {
              title: "Period",
              dataIndex: "month",
              key: "month",
              render: (value) => (
                <span style={{ fontWeight: 600 }}>{value}</span>
              ),
            },
            {
              title: "Events",
              dataIndex: "events",
              key: "events",
              render: (value) => (
                <span style={{ fontWeight: 700, color: C.blue }}>{value}</span>
              ),
            },
            {
              title: "Bookings",
              dataIndex: "bookings",
              key: "bookings",
              render: (value) => (
                <span style={{ fontWeight: 700, color: C.purple }}>
                  {value}
                </span>
              ),
            },
            {
              title: "Revenue",
              dataIndex: "revenue",
              key: "revenue",
              render: (value) => (
                <span style={{ fontWeight: 700, color: C.green }}>
                  ${value.toLocaleString()}
                </span>
              ),
            },
            {
              title: "Cancelled",
              dataIndex: "cancelled",
              key: "cancelled",
              render: (value) => (
                <Tag
                  color={value > 1 ? "red" : value === 1 ? "orange" : "green"}
                >
                  {value > 0 ? value : "None"}
                </Tag>
              ),
            },
          ]}
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
