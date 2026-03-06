import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, InputNumber, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import style from "./signup.module.css";
import { useState } from "react";
import { addUser } from "../../Services/userAuth";

function Signup() {
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function onFinish(value) {
    let update_value = {
      ...value,
      status: "active",
      role: "organizer",
      profileImage: "profile.png",
    };
    console.log(update_value);

    setIsLoading(true);

    try {
      const result = await addUser(update_value);

      if (result instanceof Error) {
        throw result;
      }

      api.success({
        title: "Sign Up Successful",
        description: "You have successfully created your account!",
        duration: 3,
        placement: "topRight",
      });

      setTimeout(() => {
        navigate("/dashboard");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      api.error({
        title: "Sign Up Failed",
        description:
          error.message || "Unable to create account. Please try again.",
        duration: 3,
        placement: "topRight",
      });
      console.error(error);
    }
  }

  function onFinishFailed(err) {
    api.error({
      title: "Sign Up Failed",
      description: "Sign Up failed due to some error. Try again",
      duration: 3,
      placement: "topRight",
    });
    console.error(err);
  }

  return (
    <Spin description="loading" spinning={isLoading}>
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
              name={"firstName"}
              label={"First Name"}
              rules={[
                { required: true, message: "Enter First Name" },
                {
                  pattern: /^[a-zA-z]+$/,
                  message: "Only Characters are allowed",
                },
              ]}
            >
              <Input size="large" placeholder="First Name" />
            </Form.Item>

            <Form.Item
              name={"lastName"}
              label={"Last Name"}
              rules={[
                { required: true, message: "Enter Last Name" },
                {
                  pattern: /^[a-zA-z]+$/,
                  message: "Only Characters are allowed",
                },
              ]}
            >
              <Input size="large" placeholder="Last Name" />
            </Form.Item>
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
                {
                  type: "email",
                  message: "Entered value is not a valid email",
                },
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

            <Form.Item
              name={"phone"}
              label={"Phone Number"}
              rules={[
                {
                  required: true,
                  message: "Enter Phone Number",
                },
                {
                  pattern: /^\+?[0-9]+$/,
                  message: "Only numbers are allowed (0-9) without space",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Phone Number"
                prefix={<PhoneOutlined />}
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
    </Spin>
  );
}

export default Signup;
