import {
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  BarChartOutlined,
  PieChartOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Tag,
  Table,
  Progress,
  Alert,
  Empty,
  Button,
  Space,
  Spin,
  message,
  DatePicker,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import InsightStatCard from "../../Components/Insights/InsightStatCard";
import InsightSectionHeader from "../../Components/Insights/InsightSectionHeader";
import InsightBarChart from "../../Components/Insights/InsightBarChart";
import { INSIGHT_COLORS as C } from "../../Components/Insights/theme";
import {
  buildTimelineData,
  toNumber,
} from "../../Components/Insights/insightUtils";
import { fetchSystemReports, fetchReportsByDateRange } from "../../Services/reportSlice";
import reportService from "../../Services/reportService";

const { RangePicker } = DatePicker;

function Reports() {
  const dispatch = useDispatch();
  const { data: reportData, loading, error } = useSelector((state) => state.report);
  const [downloading, setDownloading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  // Fetch reports on mount and when date range changes
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
      dispatch(
        fetchReportsByDateRange({
          startDate,
          endDate,
          organizerId: null,
        })
      );
    } else {
      dispatch(fetchSystemReports());
    }
  }, [dateRange, dispatch]);

  // Use Redux data exclusively
  const approvedEvents = useMemo(() => {
    return reportData?.eventDetails || [];
  }, [reportData]);

  const paidBookings = useMemo(() => {
    return reportData?.bookingDetails || [];
  }, [reportData]);

  const completedPayments = useMemo(() => {
    return reportData?.stats || {};
  }, [reportData]);

  const displayData = useMemo(() => {
    return reportData?.timelineData || [];
  }, [reportData]);

  const totalEvents = reportData?.stats?.totalEvents || 0;

  const totalBookings = reportData?.stats?.totalBookings || 0;

  const totalRevenue = reportData?.stats?.totalRevenue || 0;

  const totalCancelled = reportData?.stats?.cancelledBookings || 0;

  const statusCounts = {
    upcoming: reportData?.stats?.upcomingEvents || 0,
    ongoing: reportData?.stats?.ongoingEvents || 0,
    completed: reportData?.stats?.completedEvents || 0,
    cancelled: reportData?.stats?.cancelledEvents || 0,
  };

  const categoryData = useMemo(() => {
    return reportData?.categoryBreakdown || [];
  }, [reportData]);

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
          0
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

  const handleDateRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange(dates);
    } else {
      setDateRange(null);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await reportService.downloadSystemReportPDF();
      message.success("Report downloaded successfully as PDF");
    } catch (error) {
      message.error("Failed to download PDF report");
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadTXT = async () => {
    setDownloading(true);
    try {
      await reportService.downloadSystemReportTXT();
      message.success("Report downloaded successfully as TXT");
    } catch (error) {
      message.error("Failed to download TXT report");
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

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
            Real-time data fetched from the database
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloading}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            loading={downloading}
            onClick={handleDownloadTXT}
          >
            Download TXT
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message={error.includes("Access token required") || error.includes("Invalid or expired token")
            ? "Authentication Required - Please log in to view reports"
            : `Error loading reports: ${error}`}
          description={error.includes("Access token required") || error.includes("Invalid or expired token")
            ? "Your session has expired. Please log in again."
            : "Check your connection and try again."}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      {!error && (
        <Alert
          message="Reports are generated from real backend data"
          type="success"
          showIcon
          closable
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      <Card
        style={{
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>Filter by Date Range:</span>
          <RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            format="YYYY-MM-DD"
          />
          {dateRange && (
            <Button
              type="link"
              onClick={() => setDateRange(null)}
              style={{ color: "#ff4d4f" }}
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      <Spin 
        spinning={loading} 
        indicator={<LoadingOutlined style={{ fontSize: 48, color: C.blue }} />}
        tip="Loading report data..."
      >
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
                    value:
                      reportData?.additionalMetrics
                        ? `$${Math.round(reportData.additionalMetrics.avgRevenuePerEvent).toLocaleString()}`
                        : `$${Math.round(totalRevenue / 12).toLocaleString()}`,
                    color: C.green,
                    pct: 72,
                  },
                  {
                    label: "Avg. Bookings / Period",
                    value:
                      reportData?.additionalMetrics
                        ? Math.round(reportData.additionalMetrics.avgBookingsPerEvent)
                        : Math.round(totalBookings / 12),
                    color: C.blue,
                    pct: 65,
                  },
                  {
                    label: "Cancellation Rate",
                    value:
                      reportData?.additionalMetrics
                        ? `${reportData.additionalMetrics.cancellationRate}%`
                        : totalBookings > 0
                        ? `${Math.round((totalCancelled / totalBookings) * 100)}%`
                        : "0%",
                    color: C.red,
                    pct:
                      reportData?.additionalMetrics
                        ? parseFloat(reportData.additionalMetrics.cancellationRate)
                        : totalBookings > 0
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
                            Math.round((totalBookings / totalEvents) * 100)
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
      </Spin>
    </div>
  );
}

export default Reports;
