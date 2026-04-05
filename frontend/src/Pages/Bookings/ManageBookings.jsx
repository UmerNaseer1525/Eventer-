import {
  CalendarOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Table,
  Empty,
  Popconfirm,
  notification,
  Badge,
  Descriptions,
  Radio,
  Divider,
  Steps,
  Result,
  Tooltip,
  Select,
} from "antd";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteBooking, updateBooking } from "../../Services/bookingSlice";
import { addPayment } from "../../Services/paymentSlice";

const { Option } = Select;

// ── Demo bookings (shown when Redux store is empty) ───────────────────────────
const DEMO_BOOKINGS = [
  {
    id: "BK-001",
    name: "Tech Conference 2026",
    category: "Conference",
    location: "Expo Center, City A",
    contact: "+1234567890",
    status: "Upcoming",
    paymentStatus: "Unpaid",
    amount: 199,
    date: "2026-06-15",
    time: "09:00 AM",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BK-002",
    name: "Music Festival",
    category: "Concert",
    location: "Open Grounds, City B",
    contact: "+9876543210",
    status: "Ongoing",
    paymentStatus: "Paid",
    amount: 89,
    date: "2026-04-20",
    time: "06:00 PM",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BK-003",
    name: "Startup Summit",
    category: "Conference",
    location: "Innovation Hub, City D",
    contact: "+1122334455",
    status: "Upcoming",
    paymentStatus: "Unpaid",
    amount: 249,
    date: "2026-07-05",
    time: "10:00 AM",
    cover: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BK-004",
    name: "Jazz Night",
    category: "Concert",
    location: "Blue Room, City E",
    contact: "+9988776655",
    status: "Upcoming",
    paymentStatus: "Unpaid",
    amount: 49,
    date: "2026-04-28",
    time: "08:00 PM",
    cover: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "BK-005",
    name: "Photography Workshop",
    category: "Workshop",
    location: "Studio 7, City A",
    contact: "+1231231234",
    status: "Completed",
    paymentStatus: "Paid",
    amount: 79,
    date: "2026-03-22",
    time: "11:00 AM",
    cover: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=600&q=80",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  Upcoming:  "blue",
  Ongoing:   "green",
  Completed: "default",
  Cancelled: "red",
};

const PAY_STATUS_CONFIG = {
  Paid:    { color: "success", icon: <CheckCircleOutlined />, text: "Paid"    },
  Unpaid:  { color: "warning", icon: <ClockCircleOutlined />, text: "Unpaid"  },
  Refunded:{ color: "default", icon: <CloseCircleOutlined />, text: "Refunded"},
};

// ── Format card number with spaces ───────────────────────────────────────────
function formatCard(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val) {
  const v = val.replace(/\D/g, "").slice(0, 4);
  return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
}

// ── Booking Detail Modal ──────────────────────────────────────────────────────
function DetailModal({ booking, open, onClose }) {
  if (!booking) return null;
  const payCfg = PAY_STATUS_CONFIG[booking.paymentStatus] || PAY_STATUS_CONFIG.Unpaid;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={<Button type="primary" block onClick={onClose} style={{ borderRadius: 8 }}>Close</Button>}
      width={500}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ position: "relative" }}>
        <img src={booking.cover} alt={booking.name} style={{ width: "100%", height: 190, objectFit: "cover", borderRadius: "8px 8px 0 0", display: "block" }} />
        <Tag color="purple" style={{ position: "absolute", top: 12, left: 12, fontWeight: 600, borderRadius: 20, padding: "2px 12px" }}>
          {booking.category}
        </Tag>
        <Tag color={STATUS_COLOR[booking.status]} style={{ position: "absolute", top: 12, right: 12, fontWeight: 600, borderRadius: 20, padding: "2px 12px" }}>
          {booking.status}
        </Tag>
      </div>
      <div style={{ padding: "20px 24px 16px" }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800 }}>{booking.name}</h2>
        <Descriptions column={1} size="small" bordered labelStyle={{ fontWeight: 600, width: 130 }}>
          <Descriptions.Item label="Booking ID">{booking.id}</Descriptions.Item>
          <Descriptions.Item label={<span><EnvironmentOutlined /> Location</span>}>{booking.location}</Descriptions.Item>
          <Descriptions.Item label={<span><PhoneOutlined /> Contact</span>}>{booking.contact}</Descriptions.Item>
          <Descriptions.Item label={<span><CalendarOutlined /> Date</span>}>{booking.date} · {booking.time}</Descriptions.Item>
          <Descriptions.Item label={<span><DollarOutlined /> Amount</span>}>
            <span style={{ fontWeight: 800, color: "#1677ff", fontSize: 16 }}>${booking.amount}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Payment">
            <Tag color={payCfg.color} icon={payCfg.icon} style={{ fontWeight: 600, borderRadius: 20 }}>
              {payCfg.text}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
}

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ booking, open, onClose, onSuccess }) {
  const [form]    = Form.useForm();
  const [step,    setStep]    = useState(0); // 0 = form, 1 = success
  const [loading, setLoading] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [expiry,  setExpiry]  = useState("");

  function handlePay() {
    form.validateFields().then((vals) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(1);
        onSuccess(booking, vals);
      }, 1800);
    });
  }

  function handleClose() {
    setStep(0);
    setCardNum("");
    setExpiry("");
    form.resetFields();
    onClose();
  }

  if (!booking) return null;

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={460}
      centered
      closable={step === 0}
      maskClosable={false}
      title={
        step === 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CreditCardOutlined style={{ color: "#1677ff" }} />
            <span>Secure Payment</span>
          </div>
        ) : null
      }
    >
      {step === 0 ? (
        <>
          {/* ── Amount summary */}
          <div style={{
            background: "linear-gradient(135deg, #f0f7ff, #e6f4ff)",
            borderRadius: 12, padding: "16px 20px", marginBottom: 20,
            border: "1px solid #d6e8ff", display: "flex",
            justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>Booking</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{booking.name}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                <CalendarOutlined style={{ marginRight: 4 }} />{booking.date}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>Total Amount</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#1677ff" }}>${booking.amount}</div>
            </div>
          </div>

          {/* ── Steps */}
          <Steps
            size="small"
            current={0}
            style={{ marginBottom: 20 }}
            items={[
              { title: "Card Details" },
              { title: "Confirm"      },
              { title: "Done"         },
            ]}
          />

          {/* ── Card visual preview */}
          <div style={{
            background: "linear-gradient(135deg, #1677ff 0%, #722ed1 100%)",
            borderRadius: 16, padding: "18px 22px", marginBottom: 20,
            color: "#fff", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 24px rgba(22,119,255,0.3)",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -30, right: 30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 12, letterSpacing: 2 }}>CREDIT / DEBIT CARD</div>
            <div style={{ fontSize: 17, letterSpacing: 3, fontFamily: "monospace", fontWeight: 700, marginBottom: 16 }}>
              {cardNum
                ? cardNum.padEnd(19, "·").replace(/(.{4})/g, "$1 ").trim()
                : "•••• •••• •••• ••••"}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <div>
                <div style={{ opacity: 0.6, fontSize: 10 }}>CARD HOLDER</div>
                <div style={{ fontWeight: 600 }}>{form.getFieldValue("holderName") || "YOUR NAME"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ opacity: 0.6, fontSize: 10 }}>EXPIRES</div>
                <div style={{ fontWeight: 600 }}>{expiry || "MM/YY"}</div>
              </div>
            </div>
          </div>

          {/* ── Form */}
          <Form form={form} layout="vertical" size="large">
            <Form.Item
              name="holderName"
              label="Cardholder Name"
              rules={[{ required: true, message: "Enter cardholder name" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#aaa" }} />}
                placeholder="e.g. Ahmad Raza"
                style={{ borderRadius: 8 }}
                onChange={() => form.validateFields(["holderName"])}
              />
            </Form.Item>

            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[
                { required: true, message: "Enter card number" },
                { len: 19, message: "Enter a valid 16-digit card number" },
              ]}
            >
              <Input
                prefix={<CreditCardOutlined style={{ color: "#aaa" }} />}
                placeholder="1234 5678 9012 3456"
                value={cardNum}
                maxLength={19}
                style={{ borderRadius: 8, fontFamily: "monospace", letterSpacing: 2 }}
                onChange={(e) => {
                  const formatted = formatCard(e.target.value);
                  setCardNum(formatted);
                  form.setFieldValue("cardNumber", formatted);
                }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="expiry"
                  label="Expiry Date"
                  rules={[
                    { required: true, message: "Required" },
                    { pattern: /^\d{2}\/\d{2}$/, message: "Format: MM/YY" },
                  ]}
                >
                  <Input
                    placeholder="MM/YY"
                    maxLength={5}
                    style={{ borderRadius: 8, fontFamily: "monospace" }}
                    value={expiry}
                    onChange={(e) => {
                      const formatted = formatExpiry(e.target.value);
                      setExpiry(formatted);
                      form.setFieldValue("expiry", formatted);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cvv"
                  label="CVV"
                  rules={[
                    { required: true, message: "Required" },
                    { pattern: /^\d{3,4}$/, message: "3 or 4 digits" },
                  ]}
                >
                  <Input.Password
                    placeholder="•••"
                    maxLength={4}
                    style={{ borderRadius: 8, fontFamily: "monospace" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="saveCard" style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#666" }}>
                <LockOutlined style={{ color: "#52c41a" }} />
                Your payment is secured with 256-bit SSL encryption
              </div>
            </Form.Item>

            <Button
              type="primary"
              block
              loading={loading}
              onClick={handlePay}
              style={{ borderRadius: 8, height: 46, fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg, #1677ff, #722ed1)", border: "none", marginTop: 4 }}
            >
              {loading ? "Processing..." : `Pay $${booking.amount}`}
            </Button>
            <Button block style={{ borderRadius: 8, marginTop: 10 }} onClick={handleClose}>
              Cancel
            </Button>
          </Form>
        </>
      ) : (
        // ── Success screen
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a", fontSize: 60 }} />}
          title="Payment Successful!"
          subTitle={
            <div style={{ fontSize: 14, color: "#555" }}>
              <div>Your payment of <strong style={{ color: "#1677ff" }}>${booking.amount}</strong> for</div>
              <div><strong>{booking.name}</strong> was successful.</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#aaa" }}>Booking ID: {booking.id}</div>
            </div>
          }
          extra={
            <Button type="primary" style={{ borderRadius: 8 }} onClick={handleClose}>
              Done
            </Button>
          }
        />
      )}
    </Modal>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function ManageBookings() {
  const dispatch  = useDispatch();
  const reduxBookings = useSelector((state) => state.booking);

  const bookings = Array.isArray(reduxBookings) && reduxBookings.length > 0
    ? reduxBookings
    : DEMO_BOOKINGS;

  const [filterStatus,  setFilterStatus]  = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [viewMode,      setViewMode]      = useState("card"); // "card" | "table"
  const [detailItem,    setDetailItem]    = useState(null);
  const [payItem,       setPayItem]       = useState(null);

  // ── Filter
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const ms = filterStatus  === "all" ? true : b.status?.toLowerCase()        === filterStatus.toLowerCase();
      const mp = filterPayment === "all" ? true : b.paymentStatus?.toLowerCase() === filterPayment.toLowerCase();
      return ms && mp;
    });
  }, [bookings, filterStatus, filterPayment]);

  // ── Stats
  const totalAmount = bookings.reduce((s, b) => s + (b.amount || 0), 0);
  const paidCount   = bookings.filter((b) => b.paymentStatus === "Paid").length;
  const unpaidCount = bookings.filter((b) => b.paymentStatus === "Unpaid").length;
  const unpaidAmt   = bookings.filter((b) => b.paymentStatus === "Unpaid").reduce((s, b) => s + (b.amount || 0), 0);

  // ── Payment success handler
  function handlePaySuccess(booking, cardVals) {
    dispatch(updateBooking({ ...booking, paymentStatus: "Paid" }));
    dispatch(addPayment({
      id:          `PAY-${Date.now()}`,
      eventName:   booking.name,
      user:        cardVals.holderName,
      amount:      booking.amount,
      method:      "Credit Card",
      status:      "Completed",
      date:        new Date().toISOString().split("T")[0],
    }));
    notification.success({
      message:     "Payment Successful",
      description: `$${booking.amount} paid for "${booking.name}".`,
      icon:        <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    });
  }

  function handleCancelBooking(booking) {
    dispatch(updateBooking({ ...booking, status: "Cancelled" }));
    notification.warning({ message: "Booking Cancelled", description: `"${booking.name}" has been cancelled.` });
  }

  function handleDeleteBooking(booking) {
    dispatch(deleteBooking(booking.id));
    notification.success({ message: "Booking Removed", description: `"${booking.name}" removed from your bookings.` });
  }

  // ── Table columns
  const columns = [
    {
      title: "Event", key: "event",
      render: (_, r) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={r.cover} alt={r.name} style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
            <Tag color="purple" style={{ fontSize: 11, borderRadius: 20, marginTop: 2 }}>{r.category}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Date", dataIndex: "date", key: "date",
      render: (d, r) => (
        <div style={{ fontSize: 13 }}>
          <div style={{ fontWeight: 600 }}>{d}</div>
          <div style={{ color: "#aaa", fontSize: 12 }}>{r.time}</div>
        </div>
      ),
    },
    {
      title: "Location", dataIndex: "location", key: "location",
      render: (l) => <span style={{ fontSize: 13, color: "#555" }}><EnvironmentOutlined style={{ marginRight: 4 }} />{l}</span>,
    },
    {
      title: "Amount", dataIndex: "amount", key: "amount",
      render: (v) => <span style={{ fontWeight: 800, fontSize: 15, color: "#1677ff" }}>${v}</span>,
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s) => <Tag color={STATUS_COLOR[s] || "default"} style={{ borderRadius: 20, fontWeight: 600 }}>{s}</Tag>,
    },
    {
      title: "Payment", dataIndex: "paymentStatus", key: "paymentStatus",
      render: (p) => {
        const cfg = PAY_STATUS_CONFIG[p] || PAY_STATUS_CONFIG.Unpaid;
        return <Tag color={cfg.color} icon={cfg.icon} style={{ borderRadius: 20, fontWeight: 600 }}>{cfg.text}</Tag>;
      },
    },
    {
      title: "Actions", key: "actions", width: 180,
      render: (_, r) => (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Tooltip title="View Details">
            <Button type="primary" size="small" icon={<EyeOutlined />} style={{ borderRadius: 6 }} onClick={() => setDetailItem(r)} />
          </Tooltip>
          {r.paymentStatus === "Unpaid" && r.status !== "Cancelled" && (
            <Tooltip title="Pay Now">
              <Button
                size="small"
                icon={<CreditCardOutlined />}
                style={{ borderRadius: 6, background: "#f6ffed", borderColor: "#52c41a", color: "#52c41a" }}
                onClick={() => setPayItem(r)}
              >
                Pay
              </Button>
            </Tooltip>
          )}
          {r.status !== "Cancelled" && r.status !== "Completed" && (
            <Popconfirm title="Cancel this booking?" onConfirm={() => handleCancelBooking(r)} okText="Yes" cancelText="No" okButtonProps={{ danger: true }}>
              <Tooltip title="Cancel Booking">
                <Button size="small" style={{ borderRadius: 6, borderColor: "#faad14", color: "#faad14" }} icon={<CloseCircleOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
          <Popconfirm title="Remove this booking?" onConfirm={() => handleDeleteBooking(r)} okText="Remove" okButtonProps={{ danger: true }} cancelText="No">
            <Tooltip title="Delete">
              <Button danger size="small" icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "10px" }}>

      {/* ── Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>My Bookings</h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
          Manage your event bookings and complete pending payments.
        </p>
      </div>

      {/* ── Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: "Total Bookings", value: bookings.length,            icon: <CalendarOutlined />,   color: "#1677ff", suffix: ""   },
          { label: "Paid",           value: paidCount,                  icon: <CheckCircleOutlined />,color: "#52c41a", suffix: ""   },
          { label: "Unpaid",         value: unpaidCount,                icon: <ClockCircleOutlined />,color: "#faad14", suffix: ""   },
          { label: "Amount Due",     value: `$${unpaidAmt.toLocaleString()}`,icon: <DollarOutlined />,color: "#f5222d", suffix: ""   },
        ].map((s) => (
          <Col key={s.label} xs={12} sm={12} md={6}>
            <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderTop: `4px solid ${s.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#aaa" }}>{s.label}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Filters + View Toggle */}
      <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 20 }} styles={{ body: { padding: "14px 20px" } }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8} md={5}>
            <Select value={filterStatus} onChange={setFilterStatus} size="large" style={{ width: "100%" }}>
              <Option value="all">All Status</Option>
              <Option value="Upcoming">Upcoming</Option>
              <Option value="Ongoing">Ongoing</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={5}>
            <Select value={filterPayment} onChange={setFilterPayment} size="large" style={{ width: "100%" }}>
              <Option value="all">All Payments</Option>
              <Option value="Paid">Paid</Option>
              <Option value="Unpaid">Unpaid</Option>
              <Option value="Refunded">Refunded</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} size="large" buttonStyle="solid">
              <Radio.Button value="card">Card View</Radio.Button>
              <Radio.Button value="table">Table View</Radio.Button>
            </Radio.Group>
          </Col>
          <Col xs={24} md={8} style={{ marginLeft: "auto" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "Upcoming",  count: bookings.filter((b) => b.status === "Upcoming").length,  color: "#1677ff" },
                { label: "Unpaid",    count: unpaidCount,                                             color: "#faad14" },
                { label: "Cancelled", count: bookings.filter((b) => b.status === "Cancelled").length, color: "#f5222d" },
              ].map((b) => (
                <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", borderRadius: 8, padding: "6px 12px", fontSize: 13 }}>
                  <Badge color={b.color} />
                  <span style={{ color: "#555" }}>{b.label}</span>
                  <span style={{ fontWeight: 700, color: b.color }}>{b.count}</span>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* ── Content */}
      {filtered.length === 0 ? (
        <Card style={{ borderRadius: 14, padding: 20 }}>
          <Empty description="No bookings match your filters." />
        </Card>
      ) : viewMode === "card" ? (
        // ── Card View
        <Row gutter={[20, 20]}>
          {filtered.map((booking) => {
            const payCfg    = PAY_STATUS_CONFIG[booking.paymentStatus] || PAY_STATUS_CONFIG.Unpaid;
            const canPay    = booking.paymentStatus === "Unpaid" && booking.status !== "Cancelled";
            const canCancel = booking.status !== "Cancelled" && booking.status !== "Completed";

            return (
              <Col key={booking.id} xs={24} sm={12} lg={8} xl={6} style={{ display: "flex" }}>
                <Card
                  hoverable
                  style={{ borderRadius: 14, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
                  bodyStyle={{ padding: 0, display: "flex", flexDirection: "column", flex: 1 }}
                >
                  {/* Cover */}
                  <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                    <img src={booking.cover} alt={booking.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }} />
                    <Tag color="purple" style={{ position: "absolute", top: 10, left: 10, fontWeight: 600, borderRadius: 20, fontSize: 12 }}>{booking.category}</Tag>
                    <Tag color={STATUS_COLOR[booking.status]} style={{ position: "absolute", top: 10, right: 10, fontWeight: 600, borderRadius: 20, fontSize: 12 }}>{booking.status}</Tag>
                    <div style={{ position: "absolute", bottom: 10, left: 12, color: "#fff", fontSize: 12, fontWeight: 600 }}>
                      <CalendarOutlined style={{ marginRight: 4 }} />{booking.date}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a2e", marginBottom: 6 }}>{booking.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                      <EnvironmentOutlined style={{ marginRight: 4 }} />{booking.location}
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
                      <PhoneOutlined style={{ marginRight: 4 }} />{booking.contact}
                    </div>

                    {/* Amount + Payment status */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f5f5f5", paddingTop: 10, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>Amount</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: "#1677ff" }}>${booking.amount}</div>
                      </div>
                      <Tag color={payCfg.color} icon={payCfg.icon} style={{ borderRadius: 20, fontWeight: 600, fontSize: 12 }}>
                        {payCfg.text}
                      </Tag>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                      <Button size="small" icon={<EyeOutlined />} style={{ borderRadius: 6, flex: 1 }} onClick={() => setDetailItem(booking)}>
                        Detail
                      </Button>
                      {canPay && (
                        <Button
                          size="small"
                          type="primary"
                          icon={<CreditCardOutlined />}
                          style={{ borderRadius: 6, flex: 1, background: "linear-gradient(135deg, #1677ff, #722ed1)", border: "none" }}
                          onClick={() => setPayItem(booking)}
                        >
                          Pay Now
                        </Button>
                      )}
                      {canCancel && (
                        <Popconfirm title="Cancel booking?" onConfirm={() => handleCancelBooking(booking)} okButtonProps={{ danger: true }}>
                          <Button danger size="small" icon={<CloseCircleOutlined />} style={{ borderRadius: 6 }} />
                        </Popconfirm>
                      )}
                      <Popconfirm title="Remove booking?" onConfirm={() => handleDeleteBooking(booking)} okButtonProps={{ danger: true }}>
                        <Button danger size="small" icon={<DeleteOutlined />} style={{ borderRadius: 6 }} />
                      </Popconfirm>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        // ── Table View
        <Card style={{ borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }} styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (t, r) => `${r[0]}-${r[1]} of ${t}`, style: { padding: "12px 20px" } }}
            size="middle"
            scroll={{ x: 900 }}
          />
        </Card>
      )}

      {/* ── Modals */}
      <DetailModal  booking={detailItem} open={!!detailItem} onClose={() => setDetailItem(null)} />
      <PaymentModal booking={payItem}    open={!!payItem}    onClose={() => setPayItem(null)}    onSuccess={handlePaySuccess} />
    </div>
  );
}

export default ManageBookings;