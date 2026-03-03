import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import style from "./login.module.css";

function Login() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const onFinish = (values) => {
    // Simulate login logic
    api.success({
      message: "Login Successful",
      description: "You have successfully logged in!",
      placement: "topRight",
      duration: 3,
    });
    console.log("Login values:", values);

    // Navigate to dashboard after successful login
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const onFinishFail = (errorInfo) => {
    api.error({
      message: "Login Failed",
      description: "Please check all required fields and try again.",
      placement: "topRight",
      duration: 3,
    });
    console.error("Login error:", errorInfo);
  };

  return (
    <div className={style.container}>
      <div className={style.loginCard}>
        {contextHolder}

        <div className={style.logoSection}>
          <img src="/Logo.png" alt="EventX Logo" className={style.logo} />
          <h1 className={style.title}>EventX</h1>
          <p className={style.subtitle}>Sign in to manage your events</p>
        </div>

        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFail}
          layout="vertical"
          className={style.loginForm}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className={style.inputIcon} />}
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className={style.inputIcon} />}
              size="large"
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className={style.loginButton}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div className={style.divider}>
          <span>OR</span>
        </div>

        <p className={style.signupText}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>

      <div className={style.backgroundDecoration}></div>
    </div>
  );
}

export default Login;
