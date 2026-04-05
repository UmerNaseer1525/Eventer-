import { useState } from "react";
import { Modal, Button, Form, Input, Row, Col, Steps, Result } from "antd";
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

function formatCard(val) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(val) {
  const v = val.replace(/\D/g, "").slice(0, 4);
  return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
}

function BookingPaymentModal({ booking, open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");

  function handlePay() {
    form.validateFields().then((vals) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(1);
        onSuccess(booking, vals);
      }, 1500);
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
          <div
            style={{
              background: "linear-gradient(135deg, #f0f7ff, #e6f4ff)",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 20,
              border: "1px solid #d6e8ff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>
                Booking
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>
                {booking.name}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>
                Total Amount
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#1677ff" }}>
                ${booking.amount}
              </div>
            </div>
          </div>

          <Steps
            size="small"
            current={0}
            style={{ marginBottom: 20 }}
            items={[
              { title: "Card Details" },
              { title: "Confirm" },
              { title: "Done" },
            ]}
          />

          <div
            style={{
              background: "linear-gradient(135deg, #1677ff 0%, #722ed1 100%)",
              borderRadius: 16,
              padding: "18px 22px",
              marginBottom: 20,
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: 11,
                opacity: 0.7,
                marginBottom: 12,
                letterSpacing: 2,
              }}
            >
              CREDIT / DEBIT CARD
            </div>
            <div
              style={{
                fontSize: 17,
                letterSpacing: 3,
                fontFamily: "monospace",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              {cardNum
                ? cardNum
                    .padEnd(19, "·")
                    .replace(/(.{4})/g, "$1 ")
                    .trim()
                : "•••• •••• •••• ••••"}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <div>
                <div style={{ opacity: 0.6, fontSize: 10 }}>CARD HOLDER</div>
                <div style={{ fontWeight: 600 }}>
                  {form.getFieldValue("holderName") || "YOUR NAME"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ opacity: 0.6, fontSize: 10 }}>EXPIRES</div>
                <div style={{ fontWeight: 600 }}>{expiry || "MM/YY"}</div>
              </div>
            </div>
          </div>

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
                style={{
                  borderRadius: 8,
                  fontFamily: "monospace",
                  letterSpacing: 2,
                }}
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

            <Form.Item style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#666",
                }}
              >
                <LockOutlined style={{ color: "#52c41a" }} />
                Your payment is secured with 256-bit SSL encryption
              </div>
            </Form.Item>

            <Button
              type="primary"
              block
              loading={loading}
              onClick={handlePay}
              style={{
                borderRadius: 8,
                height: 46,
                fontSize: 15,
                fontWeight: 700,
                background: "linear-gradient(135deg, #1677ff, #722ed1)",
                border: "none",
                marginTop: 4,
              }}
            >
              {loading ? "Processing..." : `Pay $${booking.amount}`}
            </Button>
            <Button
              block
              style={{ borderRadius: 8, marginTop: 10 }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Form>
        </>
      ) : (
        <Result
          icon={
            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 60 }} />
          }
          title="Payment Successful!"
          subTitle={`Your payment for ${booking.name} was successful.`}
          extra={
            <Button
              type="primary"
              style={{ borderRadius: 8 }}
              onClick={handleClose}
            >
              Done
            </Button>
          }
        />
      )}
    </Modal>
  );
}

export default BookingPaymentModal;
