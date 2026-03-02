import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import style from "./signup.module.css";

function Signup() {
  const [api, contextHolder] = notification.useNotification();
  function onFinish(value) {
    api.success({
      title: "Sign Up Success",
      description: "You have successfully login to your account",
      duration: 3,
      placement: "topRight",
    });
    console.log(value);
  }

  function onFinishFailed(err) {
    api.error({
      title: "Sign Up failed",
      description: "Sign Up failed due to some error. Try again",
      duration: 3,
      placement: "topRight",
    });
    console.error(err);
  }
  return (
    <div className={style.container}>
      {contextHolder}
      <h2>Welcome to EventX</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name={"usename"}
          label={"Username"}
          rules={[{ required: true, message: "Please Enter Username" }]}
        >
          <Input
            size="large"
            placeholder="Username"
            prefix={<UserOutlined />}
            name="username"
          />
        </Form.Item>
        <Form.Item
          name={"Email"}
          label={"Email"}
          rules={[
            { required: true, message: "Please Enter Email" },
            { type: "email", message: "Enterd value is not email" },
          ]}
        >
          <Input
            size="large"
            placeholder="Email"
            prefix={<MailOutlined />}
            name="Email"
          />
        </Form.Item>
        <Form.Item
          name={"Password"}
          label={"Password"}
          rules={[
            { required: true, message: "Please Enter Password" },
            { min: 8, message: "Password must be 8 characters or long" },
            {
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "password must contain (words, numbers, !#@)",
            },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<LockOutlined />}
            name="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button size="large" type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      <div className={style.divider}>
        <span>OR</span>
      </div>
      <p className={style.signupText}>
        Already have an account? <a href="#">Sign In</a>
      </p>
    </div>
  );
}

export default Signup;
