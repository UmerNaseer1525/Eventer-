import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Form,
  Image,
  Input,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import styles from "./setting.module.css";
import { updateUser } from "../../Services/userService";

function Settings() {
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const defaultProfileImage = "/profile.png";
  const maxFileSizeInMB = 2;
  // Simple string state for image URL
  const [profileImage, setProfileImage] = useState(defaultProfileImage);

  async function onFinish(values) {
    setIsLoading(true);
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, value]) => {
          if (value === undefined || value === null) return false;
          if (typeof value === "string") return value.trim() !== "";
          return true;
        }),
      );

      const result = await updateUser(payload, loggedInUser?.email);
      if (result instanceof Error) {
        throw result;
      }
      api.success({
        title: "Successfully Updated",
        description: "Your information successfully updated",
        duration: 3,
        placement: "topRight",
      });
    } catch (error) {
      api.error({
        title: "Updation Failure",
        description: error.message,
        duration: 3,
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleProfileImageChange(info) {
    const selectedFile = info.file?.originFileObj;
    if (!selectedFile) {
      return;
    }
    // Use FileReader to preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  }

  function validateUploadFile(file) {
    const isAllowedType =
      file.type === "image/jpeg" || file.type === "image/png";
    const isAllowedSize = file.size / 1024 / 1024 <= maxFileSizeInMB;

    if (!isAllowedType) {
      message.error("Only JPEG and PNG images are allowed");
      return Upload.LIST_IGNORE;
    }

    if (!isAllowedSize) {
      message.error(`Image must be smaller than ${maxFileSizeInMB}MB`);
      return Upload.LIST_IGNORE;
    }

    return false;
  }

  return (
    <Spin spinning={isLoading} description="Loading">
      <div className={styles.settingsPage}>
        <h1 className={styles.title}>Settings</h1>
        <Card className={styles.settingCard}>
          <div className={styles.layout}>
            {contextHolder}
            <div className={styles.formSection}>
              <Form
                layout="vertical"
                onFinish={onFinish}
                className={styles.form}
              >
                <Form.Item
                  name={"firstName"}
                  label="First Name"
                  rules={[
                    {
                      pattern: /^[a-zA-Z]+$/,
                      message: "Only characters are allowed",
                    },
                  ]}
                >
                  <Input placeholder="First Name" size="large" />
                </Form.Item>
                <Form.Item
                  name={"lastName"}
                  label="Last Name"
                  rules={[
                    {
                      pattern: /^[a-zA-Z]+$/,
                      message: "Only characters are allowed",
                    },
                  ]}
                >
                  <Input placeholder="Last Name" size="large" />
                </Form.Item>

                <Form.Item name="username" label="Username">
                  <Input placeholder="Username" size="large" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="New Password"
                  rules={[
                    { min: 8, message: "Password must be >= characters" },
                  ]}
                >
                  <Input.Password
                    placeholder="Enter New Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    {
                      pattern: /^\+?[0-9]+$/,
                      message: "Only numbers are allowed (0-9) without space",
                    },
                  ]}
                >
                  <Input placeholder="Phone" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large">
                    Save Settings
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div className={styles.profileSection}>
              <div>
                <h3 className={styles.profileTitle}>Profile Image</h3>
                <Alert
                  type="error"
                  description="Image save and upload not work"
                />
                <img
                  src={profileImage}
                  alt="Profile"
                  className={styles.profileImage}
                />
              </div>

              <Upload
                accept="image/jpeg,image/png"
                maxCount={1}
                showUploadList={false}
                beforeUpload={validateUploadFile}
                onChange={handleProfileImageChange}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  size="large"
                  block
                >
                  Upload Image
                </Button>
              </Upload>
              <p className={styles.uploadNote}>Only JPG/PNG, max 2MB</p>
            </div>
          </div>
        </Card>
      </div>
    </Spin>
  );
}

export default Settings;
