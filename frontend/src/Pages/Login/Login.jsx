import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import style from "./login.module.css";
import { useState } from "react";
import { validateUser } from "../../Services/userService";

function Login() {
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onFinish(values) {
    setIsLoading(true);

    try {
      const result = await validateUser(values);

      if (result instanceof Error) {
        throw result;
      }

      setIsLoading(false);
      api.success({
        title: "Login Successful",
        description: "You have successfully logged in!",
        placement: "topRight",
        duration: 3,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      api.error({
        title: "Login Failed",
        description: error.message || "Unable to Login. Check your credentials",
        duration: 3,
        placement: "topRight",
      });
    }
  }

  const onFinishFail = (errorInfo) => {
    api.error({
      title: "Login Failed",
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
              loading={isLoading}
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
