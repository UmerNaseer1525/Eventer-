import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import { useNavigate } from "react-router-dom";
import style from "./signup.module.css";

function Signup() {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  function onFinish(value) {
    api.success({
      message: "Sign Up Successful",
      description: "You have successfully created your account!",
      duration: 3,
      placement: "topRight",
    });
    console.log(value);

    // Navigate to dashboard after successful signup
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  }

  function onFinishFailed(err) {
    api.error({
      message: "Sign Up Failed",
      description: "Sign Up failed due to some error. Try again",
      duration: 3,
      placement: "topRight",
    });
    console.error(err);
  }

  return (
    <div className={style.container}>
      <div className={style.signupCard}>
        {contextHolder}

        <div className={style.logoSection}>
          <img src="/Logo.png" alt="EventX Logo" className={style.logo} />
          <h1 className={style.title}>EventX</h1>
          <p className={style.subtitle}>Create your account to get started</p>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={style.signupForm}
        >
          <Form.Item
            name={"username"}
            label={"Username"}
            rules={[{ required: true, message: "Please Enter Username" }]}
          >
            <Input
              size="large"
              placeholder="Username"
              prefix={<UserOutlined className={style.inputIcon} />}
            />
          </Form.Item>

          <Form.Item
            name={"email"}
            label={"Email"}
            rules={[
              { required: true, message: "Please Enter Email" },
              { type: "email", message: "Entered value is not a valid email" },
            ]}
          >
            <Input
              size="large"
              placeholder="Email"
              prefix={<MailOutlined className={style.inputIcon} />}
            />
          </Form.Item>

          <Form.Item
            name={"password"}
            label={"Password"}
            rules={[
              { required: true, message: "Please Enter Password" },
              { min: 8, message: "Password must be 8 characters or longer" },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain letters, numbers, and special characters (@$!%*?&)",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              prefix={<LockOutlined className={style.inputIcon} />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              block
              className={style.signupButton}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className={style.divider}>
          <span>OR</span>
        </div>

        <p className={style.signinText}>
          Already have an account? <a href="/signin">Sign In</a>
        </p>
      </div>

      <div className={style.backgroundDecoration}></div>
    </div>
  );
}

export default Signup;
