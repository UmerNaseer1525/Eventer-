import { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Alert,
  Button,
  Card,
  Form,
  Input,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import styles from "./setting.module.css";
import { updateUserRecord } from "../../Services/userSlice";
import { addUnblockRequest } from "../../Services/requestSlice";

const USER_BASE_URL = "http://localhost:3000/api/users";
const BACKEND_BASE_URL = "http://localhost:3000";

function resolveImageUrl(imagePath) {
  if (!imagePath) {
    return "/profile.png";
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${BACKEND_BASE_URL}${imagePath}`;
}

function Settings() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const maxFileSizeInMB = 2;
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [accountStatus, setAccountStatus] = useState("active");

  const requests = useSelector((state) =>
    Array.isArray(state.request) ? state.request : [],
  );

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (_error) {
      return null;
    }
  }, []);
  const hasPendingUnblockRequest = useMemo(
    () =>
      requests.some(
        (request) =>
          request.type === "unblock" &&
          request.email === currentUser?.email &&
          request.status === "pending",
      ),
    [requests, currentUser?.email],
  );

  useEffect(() => {
    const loadSettingsData = async () => {
      const token = localStorage.getItem("token");

      if (!currentUser?.email || !token) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `${USER_BASE_URL}/${encodeURIComponent(currentUser.email)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Unable to fetch settings data");
        }

        const data = await response.json();

        const latestUser = { ...currentUser, ...data };
        localStorage.setItem("user", JSON.stringify(latestUser));
        window.dispatchEvent(new Event("auth-change"));

        setAccountStatus(data.status || "active");
        form.setFieldsValue({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          username: data.username || "",
          phone: data.phone || "",
        });
        setProfileImagePreview(resolveImageUrl(data.profileImage));
      } catch (error) {
        setAccountStatus(currentUser?.status || "active");
        form.setFieldsValue({
          firstName: currentUser.firstName || "",
          lastName: currentUser.lastName || "",
          username: currentUser.username || "",
          phone: currentUser.phone || "",
        });
        setProfileImagePreview(resolveImageUrl(currentUser.profileImage));
        api.warning({
          message: "Settings Loaded Partially",
          description: error.message,
          placement: "topRight",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettingsData();
  }, [api, currentUser, form]);

  function handleUnblockRequest() {
    if (!currentUser?.email) {
      message.error("Unable to identify your account.");
      return;
    }

    dispatch(
      addUnblockRequest({
        email: currentUser.email,
        fullName:
          `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
        username: currentUser.username,
        reason: "I request account reactivation.",
      }),
    );

    api.success({
      message: "Request Submitted",
      description: "Your unblock request has been sent to admin.",
      placement: "topRight",
    });
  }

  async function onFinish(values) {
    setIsLoading(true);
    try {
      const formData = new FormData();

      if (values.firstName?.trim()) {
        formData.append("firstName", values.firstName.trim());
      }
      if (values.lastName?.trim()) {
        formData.append("lastName", values.lastName.trim());
      }
      if (values.username?.trim()) {
        formData.append("username", values.username.trim());
      }
      if (values.phone?.trim()) {
        formData.append("phone", values.phone.trim());
      }
      if (values.password?.trim()) {
        formData.append("password", values.password.trim());
      }
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const response = await dispatch(updateUserRecord(formData));
      const updatedUser = response?.user;

      if (updatedUser?.profileImage) {
        setProfileImagePreview(resolveImageUrl(updatedUser.profileImage));
      }

      api.success({
        message: "Successfully Updated",
        description: "Your settings were saved successfully.",
        duration: 3,
        placement: "topRight",
      });
      form.setFieldValue("password", "");
      setProfileImageFile(null);
    } catch (error) {
      api.error({
        message: "Update Failed",
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

    setProfileImageFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target.result);
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
        {String(accountStatus || "").toLowerCase() === "blocked" ? (
          <Card className={styles.settingCard}>
            {contextHolder}
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message="Your account is blocked"
              description="You currently cannot access other pages. Submit a request to admin to unblock your account."
            />
            <Button
              type="primary"
              size="large"
              disabled={hasPendingUnblockRequest}
              onClick={handleUnblockRequest}
            >
              {hasPendingUnblockRequest
                ? "Request Already Sent"
                : "Request to Unblock"}
            </Button>
          </Card>
        ) : (
          <Card className={styles.settingCard}>
            <div className={styles.layout}>
              {contextHolder}
              <div className={styles.formSection}>
                <Form
                  form={form}
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
                  <Avatar
                    src={profileImagePreview}
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
        )}
      </div>
    </Spin>
  );
}

export default Settings;
