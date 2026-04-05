import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Statistic,
  Tag,
  Row,
  Col,
  Button,
  Space,
} from "antd";
import { useEffect } from "react";

// Final version will replace these demo methods with Stripe-powered checkout.
const PAYMENT_METHODS = ["Credit Card", "Bank Transfer", "Wallet"];

function EventBookingPaymentModal({
  event,
  open,
  loading,
  onClose,
  onConfirm,
}) {
  const [form] = Form.useForm();
  const seatCount = Form.useWatch("seatCount", form) || 1;

  const seatsLeft = Math.max(
    0,
    Number(
      event?.remainingSeats ?? event?.number_of_guests ?? event?.capacity ?? 0,
    ),
  );
  const ticketPrice = Number(event?.ticketPrice ?? 0);
  const totalAmount = seatCount * ticketPrice;

  useEffect(() => {
    if (open && event) {
      form.setFieldsValue({
        fullName: "",
        email: "",
        seatCount: 1,
        paymentMethod: "Credit Card",
      });
    }
  }, [event, form, open]);

  function handleConfirm() {
    form.validateFields().then((values) => {
      // Temporary local confirmation flow; Stripe checkout will be wired here.
      onConfirm({ ...values, seatCount, totalAmount });
    });
  }

  if (!event) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      title="Payment & Seat Reservation"
      destroyOnClose
      maskClosable={!loading}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #f0f7ff, #e6f4ff)",
          border: "1px solid #d6e8ff",
          borderRadius: 14,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "#6b7a90" }}>Event</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>
              {event.title}
            </div>
            <div style={{ fontSize: 12, color: "#6b7a90", marginTop: 6 }}>
              {event.location}
            </div>
          </div>
          <Statistic
            title="Total"
            value={totalAmount}
            prefix="$"
            valueStyle={{ color: "#1677ff", fontSize: 28, fontWeight: 900 }}
          />
        </div>
        <Space size={16} wrap style={{ marginTop: 12 }}>
          <Tag color="blue">Seats left: {seatsLeft}</Tag>
          <Tag color="purple">Ticket: ${ticketPrice}</Tag>
          <Tag color="green">Category: {event.category}</Tag>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        size="large"
        initialValues={{ seatCount: 1, paymentMethod: "Credit Card" }}
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: "Enter your name" }]}
        >
          <Input placeholder="Your full name" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="name@example.com" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="seatCount"
              label="Seats"
              rules={[{ required: true, message: "Choose seats" }]}
            >
              <InputNumber
                min={1}
                max={Math.max(1, seatsLeft)}
                style={{ width: "100%", borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="paymentMethod"
              label="Payment Method"
              rules={[{ required: true, message: "Choose a payment method" }]}
            >
              <Select
                options={PAYMENT_METHODS.map((method) => ({
                  label: method,
                  value: method,
                }))}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0 18px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <span style={{ color: "#666" }}>
            Payment confirmation will reserve your selected seats.
          </span>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#1a1a2e" }}>
            ${totalAmount}
          </span>
        </div>

        <Button
          type="primary"
          block
          loading={loading}
          onClick={handleConfirm}
          style={{ borderRadius: 8, height: 46, fontWeight: 700 }}
        >
          {loading ? "Processing Payment..." : "Confirm & Reserve Seat"}
        </Button>
        <Button
          block
          style={{ borderRadius: 8, marginTop: 10 }}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
      </Form>
    </Modal>
  );
}

export default EventBookingPaymentModal;
