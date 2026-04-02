import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Skeleton,
  Tag,
  Typography,
  notification,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import style from "./profile.module.css";

const { Title, Text } = Typography;

const USER_BASE_URL = "http://localhost:3000/api/users";
const BACKEND_BASE_URL = "http://localhost:3000";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function resolveImageUrl(imagePath) {
  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${BACKEND_BASE_URL}${imagePath}`;
}

function ProfilePage({ title }) {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const user = getStoredUser();
      const token = localStorage.getItem("token");

      if (!user?.email || !token) {
        setLoading(false);
        api.error({
          message: "Profile Error",
          description: "User session not found. Please login again.",
          placement: "topRight",
        });
        return;
      }

      try {
        const response = await fetch(
          `${USER_BASE_URL}/${encodeURIComponent(user.email)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Unable to load profile data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        // Fallback keeps page usable if the profile endpoint temporarily fails.
        setProfileData(user);

        api.warning({
          message: "Limited Profile Data",
          description: error.message,
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [api]);

  if (loading) {
    return (
      <div className={style.profile_page}>
        <Card>
          <Skeleton active avatar paragraph={{ rows: 5 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className={style.profile_page}>
      {contextHolder}
      <Card className={style.profile_card}>
        <div className={style.profile_summary}>
          <Avatar
            size={110}
            src={resolveImageUrl(profileData?.profileImage)}
            icon={<UserOutlined />}
            className={style.avatar}
          />

          <Title level={3} className={style.name}>
            {`${profileData?.firstName || ""} ${profileData?.lastName || ""}`.trim() ||
              "Unknown User"}
          </Title>

          <Text className={style.email}>
            {profileData?.email || "No email"}
          </Text>

          <Tag color={profileData?.role === "admin" ? "gold" : "blue"}>
            {(profileData?.role || "user").toUpperCase()}
          </Tag>

          <div className={style.info_grid}>
            <div className={style.info_item}>
              <Text type="secondary">Username</Text>
              <Text>{profileData?.username || "-"}</Text>
            </div>
            <div className={style.info_item}>
              <Text type="secondary">Phone</Text>
              <Text>{profileData?.phone || "-"}</Text>
            </div>
            <div className={style.info_item}>
              <Text type="secondary">Status</Text>
              <Text>{profileData?.status || "active"}</Text>
            </div>
            <div className={style.info_item}>
              <Text type="secondary">Role</Text>
              <Text>{profileData?.role || "user"}</Text>
            </div>
          </div>

          <div className={style.actions}>
            <Button type="primary" onClick={() => navigate("/settings")}>
              Edit In Settings
            </Button>
            <Text type="secondary" className={style.subtitle}>
              {title} is read-only. Use Settings to update profile details and
              image.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;
