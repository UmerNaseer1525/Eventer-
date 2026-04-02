import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  FilterOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BankOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Input,
  Select,
  Button,
  Modal,
  Popconfirm,
  notification,
  Descriptions,
  Badge,
  Divider,
  DatePicker,
  Tooltip,
  Empty,
} from "antd";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deletePayment, updatePayment } from "../../Services/paymentSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;

// ─── Constants ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Completed: { color: "success",   antColor: "green",   icon: <CheckCircleOutlined /> },
  Pending:   { color: "warning",   antColor: "gold",    icon: <ClockCircleOutlined /> },
  Failed:    { color: "error",     antColor: "red",     icon: <CloseCircleOutlined /> },
  Refunded:  { color: "default",   antColor: "default", icon: <CloseCircleOutlined /> },
};

const METHOD_ICONS = {
  "Credit Card": <CreditCardOutlined />,
  "Bank Transfer": <BankOutlined />,
  "Wallet": <WalletOutlined />,
};

// ─── Fallback demo data (shown when Redux store is empty) ──────────────────────
const DEMO_PAYMENTS = [
  { id: "PAY-001", eventName: "Tech Conference 2026", user: "Ali Hassan",    amount: 199,  method: "Credit Card",  status: "Completed", date: "2026-03-15", email: "ali@example.com"    },
  { id: "PAY-002", eventName: "Music Festival",       user: "Sara Khan",     amount: 89,   method: "Wallet",       status: "Completed", date: "2026-03-18", email: "sara@example.com"   },
  { id: "PAY-003", eventName: "Startup Summit",       user: "Bilal Ahmed",   amount: 249,  method: "Bank Transfer",status: "Pending",   date: "2026-03-20", email: "bilal@example.com"  },
  { id: "PAY-004", eventName: "Art & Design Expo",    user: "Hina Malik",    amount: 59,   method: "Credit Card",  status: "Failed",    date: "2026-03-22", email: "hina@example.com"   },
  { id: "PAY-005", eventName: "Jazz Night",           user: "Usman Tariq",   amount: 49,   method: "Wallet",       status: "Completed", date: "2026-03-25", email: "usman@example.com"  },
  { id: "PAY-006", eventName: "Tech Conference 2026", user: "Ayesha Raza",   amount: 199,  method: "Credit Card",  status: "Refunded",  date: "2026-03-26", email: "ayesha@example.com" },
  { id: "PAY-007", eventName: "Music Festival",       user: "Kamran Shah",   amount: 89,   method: "Bank Transfer",status: "Completed", date: "2026-03-28", email: "kamran@example.com" },
  { id: "PAY-008", eventName: "Photography Workshop", user: "Zara Noor",     amount: 79,   method: "Wallet",       status: "Pending",   date: "2026-03-30", email: "zara@example.com"   },
  { id: "PAY-009", eventName: "Startup Summit",       user: "Faisal Iqbal",  amount: 249,  method: "Credit Card",  status: "Completed", date: "2026-04-01", email: "faisal@example.com" },
  { id: "PAY-010", eventName: "Jazz Night",           user: "Maryam Butt",   amount: 49,   method: "Wallet",       status: "Failed",    date: "2026-04-02", email: "maryam@example.com" },
];

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function PaymentDetailModal({ payment, open, onClose }) {
  if (!payment) return null;
  const cfg = STATUS_CONFIG[payment.status] || STATUS_CONFIG.Pending;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <DollarOutlined style={{ color: "#1677ff" }} />
          <span>Payment Details</span>
        </div>
      }
      footer={
        <Button type="primary" onClick={onClose} block style={{ borderRadius: 8 }}>
          Close
        </Button>
      }
      width={500}
      centered
    >
      {/* Amount hero */}
      <div
        style={{
          textAlign: "center",
          background: "linear-gradient(135deg, #f0f7ff, #e6f4ff)",
          borderRadius: 12,
          padding: "24px 0 20px",
          marginBottom: 20,
          border: "1px solid #d6e8ff",
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 900, color: "#1677ff" }}>
          ${payment.amount?.toLocaleString()}
        </div>
        <Tag
          color={cfg.antColor}
          icon={cfg.icon}
          style={{ marginTop: 8, fontSize: 13, padding: "2px 14px", borderRadius: 20 }}
        >
          {payment.status}
        </Tag>
      </div>

      <Descriptions column={1} size="small" bordered labelStyle={{ fontWeight: 600, width: 140 }}>
        <Descriptions.Item label="Payment ID">{payment.id}</Descriptions.Item>
        <Descriptions.Item label="Event">{payment.eventName}</Descriptions.Item>
        <Descriptions.Item label="User">{payment.user}</Descriptions.Item>
        <Descriptions.Item label="Email">{payment.email || "—"}</Descriptions.Item>
        <Descriptions.Item label="Method">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {METHOD_ICONS[payment.method] || <CreditCardOutlined />}
            {payment.method}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Date">{payment.date}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, prefix, icon, color, subtitle }) {
  return (
    <Card
      style={{
        borderRadius: 14,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        borderTop: `4px solid ${color}`,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4, fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#1a1a2e" }}>
            {prefix}{typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{subtitle}</div>
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

// ─── Main Component ────────────────────────────────────────────────────────────
function Payments() {
  const dispatch = useDispatch();
  const reduxPayments = useSelector((state) => state.payment);

  // Use Redux data if available, else fall back to demo
  const allPayments = Array.isArray(reduxPayments) && reduxPayments.length > 0
    ? reduxPayments
    : DEMO_PAYMENTS;

  // ── Filter state
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [methodFilter, setMethod]   = useState("all");
  const [dateRange, setDateRange]   = useState(null);

  // ── Modal state
  const [detailPayment, setDetail]  = useState(null);

  // ── Derived / filtered list
  const filtered = useMemo(() => {
    return allPayments.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.id?.toLowerCase().includes(q) ||
        p.user?.toLowerCase().includes(q) ||
        p.eventName?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchMethod = methodFilter === "all" || p.method === methodFilter;
      const matchDate =
        !dateRange ||
        (p.date >= dateRange[0].format("YYYY-MM-DD") &&
          p.date <= dateRange[1].format("YYYY-MM-DD"));
      return matchSearch && matchStatus && matchMethod && matchDate;
    });
  }, [allPayments, search, statusFilter, methodFilter, dateRange]);

  // ── Stats
  const totalRevenue    = allPayments.filter((p) => p.status === "Completed").reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount   = allPayments.filter((p) => p.status === "Pending").reduce((s, p) => s + (p.amount || 0), 0);
  const refundedAmount  = allPayments.filter((p) => p.status === "Refunded").reduce((s, p) => s + (p.amount || 0), 0);
  const completedCount  = allPayments.filter((p) => p.status === "Completed").length;
  const pendingCount    = allPayments.filter((p) => p.status === "Pending").length;
  const failedCount     = allPayments.filter((p) => p.status === "Failed").length;

  // ── Handlers
  function handleDelete(payment) {
    dispatch(deletePayment(payment.id));
    notification.success({
      message: "Payment Deleted",
      description: `Payment ${payment.id} has been removed.`,
    });
  }

  function handleMarkComplete(payment) {
    dispatch(updatePayment({ ...payment, status: "Completed" }));
    notification.success({
      message: "Payment Updated",
      description: `${payment.id} marked as Completed.`,
    });
  }

  function handleRefund(payment) {
    dispatch(updatePayment({ ...payment, status: "Refunded" }));
    notification.warning({
      message: "Payment Refunded",
      description: `${payment.id} has been marked as Refunded.`,
    });
  }

  // ── Table columns
  const columns = [
    {
      title: "Payment ID",
      dataIndex: "id",
      key: "id",
      width: 130,
      render: (id) => (
        <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1677ff", fontSize: 13 }}>
          {id}
        </span>
      ),
    },
    {
      title: "Event",
      dataIndex: "eventName",
      key: "eventName",
      ellipsis: true,
      render: (name) => <span style={{ fontWeight: 600 }}>{name}</span>,
    },
    {
      title: "User",
      key: "user",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.user}</div>
          {r.email && <div style={{ fontSize: 11, color: "#aaa" }}>{r.email}</div>}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (v) => (
        <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>
          ${v?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (m) => (
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
          {METHOD_ICONS[m] || <CreditCardOutlined />} {m}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (d) => <span style={{ color: "#666", fontSize: 13 }}>{d}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Completed", value: "Completed" },
        { text: "Pending",   value: "Pending"   },
        { text: "Failed",    value: "Failed"    },
        { text: "Refunded",  value: "Refunded"  },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
        return (
          <Tag
            color={cfg.antColor}
            icon={cfg.icon}
            style={{ fontWeight: 600, borderRadius: 20, padding: "2px 10px" }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 160,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {/* View */}
          <Tooltip title="View Details">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              style={{ borderRadius: 6 }}
              onClick={() => setDetail(record)}
            />
          </Tooltip>

          {/* Mark Complete — only for Pending / Failed */}
          {(record.status === "Pending" || record.status === "Failed") && (
            <Tooltip title="Mark as Completed">
              <Popconfirm
                title="Mark as Completed?"
                onConfirm={() => handleMarkComplete(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  icon={<CheckCircleOutlined />}
                  style={{ borderRadius: 6, borderColor: "#52c41a", color: "#52c41a" }}
                />
              </Popconfirm>
            </Tooltip>
          )}

          {/* Refund — only for Completed */}
          {record.status === "Completed" && (
            <Tooltip title="Refund">
              <Popconfirm
                title="Issue a refund for this payment?"
                onConfirm={() => handleRefund(record)}
                okText="Refund"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
              >
                <Button
                  size="small"
                  icon={<CloseCircleOutlined />}
                  style={{ borderRadius: 6, borderColor: "#faad14", color: "#faad14" }}
                />
              </Popconfirm>
            </Tooltip>
          )}

          {/* Delete */}
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this payment record?"
              onConfirm={() => handleDelete(record)}
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                style={{ borderRadius: 6 }}
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      {/* ── Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>
          Payments
        </h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
          Track, manage, and review all event payment transactions.
        </p>
      </div>

      {/* ── Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Revenue"
            value={totalRevenue}
            prefix="$"
            icon={<DollarOutlined />}
            color="#1677ff"
            subtitle={`${completedCount} completed payments`}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Pending Amount"
            value={pendingAmount}
            prefix="$"
            icon={<ClockCircleOutlined />}
            color="#faad14"
            subtitle={`${pendingCount} awaiting`}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Transactions"
            value={allPayments.length}
            icon={<RiseOutlined />}
            color="#52c41a"
            subtitle={`${failedCount} failed`}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Refunded"
            value={refundedAmount}
            prefix="$"
            icon={<WalletOutlined />}
            color="#f5222d"
            subtitle={`${allPayments.filter((p) => p.status === "Refunded").length} refunds`}
          />
        </Col>
      </Row>

      {/* ── Status Summary badges */}
      <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
        {[
          { label: "Completed", count: completedCount,                                              color: "#52c41a"  },
          { label: "Pending",   count: pendingCount,                                                color: "#faad14"  },
          { label: "Failed",    count: failedCount,                                                 color: "#f5222d"  },
          { label: "Refunded",  count: allPayments.filter((p) => p.status === "Refunded").length,  color: "#8c8c8c"  },
        ].map((s) => (
          <Col key={s.label}>
            <div
              style={{
                background: "#fff",
                border: `1.5px solid ${s.color}33`,
                borderRadius: 10,
                padding: "8px 18px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
              onClick={() => setStatus(s.label === statusFilter ? "all" : s.label)}
            >
              <Badge color={s.color} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{s.label}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: s.color,
                  background: s.color + "18",
                  borderRadius: 20,
                  padding: "0 8px",
                }}
              >
                {s.count}
              </span>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Filters */}
      <Card
        style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }}
        styles={{ body: { padding: "16px 20px" } }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={7}>
            <Input
              placeholder="Search by ID, user, event, email..."
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatus}
              size="large"
              style={{ width: "100%" }}
            >
              <Option value="all">All Status</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Failed">Failed</Option>
              <Option value="Refunded">Refunded</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={methodFilter}
              onChange={setMethod}
              size="large"
              style={{ width: "100%" }}
            >
              <Option value="all">All Methods</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="Wallet">Wallet</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              size="large"
              style={{ width: "100%", borderRadius: 8 }}
              onChange={setDateRange}
            />
          </Col>
          <Col xs={24} sm={12} md={3}>
            <Button
              icon={<FilterOutlined />}
              size="large"
              style={{ width: "100%", borderRadius: 8 }}
              onClick={() => {
                setSearch("");
                setStatus("all");
                setMethod("all");
                setDateRange(null);
              }}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      {/* ── Table */}
      <Card
        style={{ borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        styles={{ body: { padding: 0 } }}
      >
        <div
          style={{
            padding: "16px 20px 12px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
            All Transactions
          </span>
          <Tag color="blue" style={{ fontWeight: 600, borderRadius: 20 }}>
            {filtered.length} records
          </Tag>
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 40 }}>
            <Empty description="No payments match your filters." />
          </div>
        ) : (
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            pagination={{
              pageSize: 8,
              showSizeChanger: true,
              pageSizeOptions: ["8", "15", "30"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} payments`,
              style: { padding: "12px 20px" },
            }}
            size="middle"
            scroll={{ x: 900 }}
            rowClassName={(record) =>
              record.status === "Failed" ? "failed-row" : ""
            }
            style={{ borderRadius: "0 0 14px 14px", overflow: "hidden" }}
          />
        )}
      </Card>

      {/* ── Detail Modal */}
      <PaymentDetailModal
        payment={detailPayment}
        open={!!detailPayment}
        onClose={() => setDetail(null)}
      />

      {/* ── Row highlight style */}
      <style>{`
        .failed-row td { background: #fff8f8 !important; }
        .failed-row:hover td { background: #fff0f0 !important; }
      `}</style>
    </div>
  );
}

export default Payments;