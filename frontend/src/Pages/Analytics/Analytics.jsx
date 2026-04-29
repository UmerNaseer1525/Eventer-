import {
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Tag, Table, Progress, Empty, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import InsightStatCard from "../../Components/Insights/InsightStatCard";
import InsightSectionHeader from "../../Components/Insights/InsightSectionHeader";
import InsightBarChart from "../../Components/Insights/InsightBarChart";
import InsightLineChart from "../../Components/Insights/InsightLineChart";
import InsightDonutChart from "../../Components/Insights/InsightDonutChart";
import { INSIGHT_COLORS as C } from "../../Components/Insights/theme";
import { fetchAnalytics } from "../../Services/analyticsSlice";

function Analytics() {
  const dispatch = useDispatch();
  const analytics = useSelector((state) => state.analytics?.data);
  const loading = useSelector((state) => state.analytics?.loading);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  // Extract data from backend response
  const stats = analytics?.stats || {};
  const timelineData = analytics?.timelineData || [];
  const categoryBreakdown = analytics?.categoryBreakdown || [];
  const statusBreakdown = analytics?.statusBreakdown || [];
  const topEvents = analytics?.topEvents || [];
  const additionalMetrics = analytics?.additionalMetrics || {};

  // Transform category breakdown for display
  const categorySegments = useMemo(() => {
    if (categoryBreakdown.length === 0) {
      return [{ name: "No Data", value: 1, color: C.blue }];
    }
    const colors = Object.values(C);
    return categoryBreakdown.map((item, index) => ({
      name: item.name,
      value: item.value,
      color: colors[index % colors.length],
    }));
  }, [categoryBreakdown]);

  // Transform status breakdown for display
  const statusSegments = useMemo(() => {
    const statusColorMap = {
      Upcoming: C.blue,
      Ongoing: C.green,
      Completed: C.cyan,
      Cancelled: C.red,
    };

    return statusBreakdown.map((item) => ({
      name: item.name,
      value: item.value,
      color: statusColorMap[item.name] || C.blue,
    }));
  }, [statusBreakdown]);

  // Calculate growth rate
  const growthRate = useMemo(() => {
    if (timelineData.length < 2) return 0;
    const current = timelineData[timelineData.length - 1]?.revenue || 0;
    const previous = timelineData[timelineData.length - 2]?.revenue || 0;
    if (previous <= 0 && current <= 0) return 0;
    if (previous <= 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  }, [timelineData]);

  const tableColumns = [
    {
      title: "#",
      key: "rank",
      width: 44,
      render: (_, __, index) => (
        <span style={{ fontWeight: 700, color: index < 3 ? C.gold : "#aaa" }}>
          {index === 0
            ? "🥇"
            : index === 1
              ? "🥈"
              : index === 2
                ? "🥉"
                : index + 1}
        </span>
      ),
    },
    {
      title: "Event",
      dataIndex: "name",
      key: "name",
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{value}</div>
          <Tag color="purple" style={{ fontSize: 11, marginTop: 2 }}>
            {row.category}
          </Tag>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <Tag
          color={
            value === "Upcoming"
              ? "blue"
              : value === "Ongoing"
                ? "green"
                : value === "Cancelled"
                  ? "red"
                  : "default"
          }
        >
          {value}
        </Tag>
      ),
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
      title: "Fill Rate",
      key: "fill",
      render: (_, row) => {
        const pct = Math.min(100, Math.round((row.bookings / 350) * 100));
        return (
          <div style={{ minWidth: 110 }}>
            <Progress
              percent={pct}
              size="small"
              strokeColor={pct > 70 ? C.green : pct > 40 ? C.gold : C.orange}
              showInfo={false}
            />
            <span style={{ fontSize: 11, color: "#888" }}>{pct}% full</span>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "10px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

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
            Analytics
          </h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
            Real-time insights for events, bookings, and payments.
          </p>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Total Events"
            value={stats.totalEvents || 0}
            icon={<CalendarOutlined />}
            color={C.blue}
            change={stats.upcomingEvents || 0}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Total Bookings"
            value={stats.totalBookings || 0}
            icon={<TeamOutlined />}
            color={C.purple}
            change={stats.totalBookings || 0}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Total Revenue"
            value={stats.totalRevenue || 0}
            prefix="$"
            icon={<DollarOutlined />}
            color={C.green}
            change={Math.round(stats.totalRevenue / 100) || 0}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <InsightStatCard
            title="Growth Rate"
            value={growthRate}
            suffix="%"
            icon={<RiseOutlined />}
            color={C.orange}
            change={growthRate}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <InsightSectionHeader
              icon={<BarChartOutlined />}
              title="Revenue"
              subtitle="This year"
            />
            <InsightBarChart
              data={timelineData}
              dataKey="revenue"
              color={C.blue}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <InsightSectionHeader
              icon={<LineChartOutlined />}
              title="Bookings Trend"
              subtitle="This year"
            />
            <InsightLineChart
              data={timelineData}
              dataKey="bookings"
              color={C.purple}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <InsightSectionHeader
              icon={<PieChartOutlined />}
              title="Events by Category"
              subtitle="Distribution across categories"
            />
            <InsightDonutChart segments={categorySegments} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <InsightSectionHeader
              icon={<PieChartOutlined />}
              title="Events by Status"
              subtitle="Status distribution"
            />
            <InsightDonutChart segments={statusSegments} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          {
            label: "Avg. Bookings / Event",
            value: additionalMetrics.avgBookingsPerEvent?.toFixed(2) || 0,
            icon: "📊",
            color: C.blue,
          },
          {
            label: "Avg. Revenue / Event",
            value:
              additionalMetrics.avgRevenuePerEvent >= 0
                ? `$${Math.round(additionalMetrics.avgRevenuePerEvent)}`
                : "$0",
            icon: "💰",
            color: C.green,
          },
          {
            label: "Cancellation Rate",
            value:
              stats.totalEvents > 0
                ? `${Math.round((stats.cancelledEvents / stats.totalEvents) * 100)}%`
                : "0%",
            icon: "❌",
            color: C.red,
          },
          {
            label: "Completion Rate",
            value:
              stats.totalEvents > 0
                ? `${Math.round(((stats.completedEvents + stats.ongoingEvents) / stats.totalEvents) * 100)}%`
                : "0%",
            icon: "✅",
            color: C.cyan,
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
                  fontSize: 22,
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
        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <InsightSectionHeader
              icon={<BarChartOutlined />}
              title="Events Created"
              subtitle="Period distribution"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {timelineData.map((row) => (
                <div
                  key={row.month}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <span
                    style={{
                      width: 32,
                      fontSize: 12,
                      color: "#888",
                      flexShrink: 0,
                    }}
                  >
                    {row.month}
                  </span>
                  <Progress
                    percent={Math.min(
                      100,
                      Math.round(
                        (row.events /
                          Math.max(
                            1,
                            ...timelineData.map((item) => item.events),
                          )) *
                          100,
                      ),
                    )}
                    showInfo={false}
                    strokeColor={C.orange}
                    trailColor="#f5f5f5"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <span
                    style={{
                      width: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.orange,
                    }}
                  >
                    {row.events}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            style={{
              borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            }}
          >
            <InsightSectionHeader
              icon={<FireOutlined />}
              title="Revenue Progress"
              subtitle="Target: $15k"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {timelineData.map((row) => {
                const pct = Math.min(
                  100,
                  Math.round((row.revenue / 15000) * 100),
                );
                return (
                  <div
                    key={row.month}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      style={{
                        width: 32,
                        fontSize: 12,
                        color: "#888",
                        flexShrink: 0,
                      }}
                    >
                      {row.month}
                    </span>
                    <Progress
                      percent={pct}
                      showInfo={false}
                      strokeColor={
                        pct >= 100 ? C.green : pct >= 60 ? C.blue : C.gold
                      }
                      trailColor="#f5f5f5"
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                    <span
                      style={{
                        width: 50,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#555",
                        textAlign: "right",
                      }}
                    >
                      ${(row.revenue / 1000).toFixed(1)}k
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
      >
        <InsightSectionHeader
          icon={<TrophyOutlined />}
          title="Top Performing Events"
          subtitle="Sorted by revenue"
        />
        {topEvents.length === 0 ? (
          <Empty description="No event data available" />
        ) : (
          <Table
            dataSource={topEvents}
            columns={tableColumns}
            rowKey={(row, index) => `${row.name}-${index}`}
            pagination={false}
            size="middle"
            scroll={{ x: 600 }}
          />
        )}
      </Card>
    </div>
  );
}
export default Analytics;
