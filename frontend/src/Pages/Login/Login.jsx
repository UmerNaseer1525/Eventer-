import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, notification } from "antd";
import style from "./login.module.css";

function Login() {
  const [api, contextHolder] = notification.useNotification();

  const onFinish = (values) => {
    // Simulate login logic
    api.success({
      message: "Login Successful",
      description: "You have successfully logged in!",
      placement: "topRight",
      duration: 3,
    });
    console.log("Login values:", values);
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
      {contextHolder}
      <h2>Welcome to EventX</h2>
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
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please enter your password" },
            // {
            //   min: 8,
            //   message: "Password must be at least 8 characters",
            // },
            // {
            //   pattern:
            //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            //   message:
            //     "Password must contain a letter, a number, and a special character (@$!%*?&)",
            // },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            size="large"
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Login
          </Button>
        </Form.Item>
      </Form>

      <div className={style.divider}>
        <span>OR</span>
      </div>

      <p className={style.signupText}>
        Don't have an account? <a href="#">Sign Up</a>
      </p>
    </div>
  );
}

export default Login;
