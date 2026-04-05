import {
  BarChartOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  LogoutOutlined,
  NotificationOutlined,
  ScheduleOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../Services/userService";
import style from "./sidebar.module.css";
import { getStoredUser, isBlockedUser, normalizeRole } from "../utils/auth";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const role = normalizeRole(user?.role);
  const blocked = role === "user" && isBlockedUser(user);

  const adminItems = [
    {
      key: "/admin-dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    { key: "/analytics", icon: <BarChartOutlined />, label: "Analytics" },
    { key: "/reports", icon: <BarChartOutlined />, label: "Reports" },
    { key: "/users", icon: <UserOutlined />, label: "User Management" },
    {
      key: "/user-requests",
      icon: <CreditCardOutlined />,
      label: "User Requests",
    },
    {
      key: "/manage-events",
      icon: <ScheduleOutlined />,
      label: "Event Requests",
    },
    { key: "/admin-profile", icon: <UserOutlined />, label: "Profile" },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    {
      key: "/notifications",
      icon: <NotificationOutlined />,
      label: "Notifications",
    },
  ];

  const userItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/events", icon: <ScheduleOutlined />, label: "Events" },
    { key: "/my-events", icon: <ScheduleOutlined />, label: "My Events" },
    {
      key: "/manage-bookings",
      icon: <CreditCardOutlined />,
      label: "Bookings",
    },
    { key: "/my-profile", icon: <UserOutlined />, label: "Profile" },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    {
      key: "/notifications",
      icon: <NotificationOutlined />,
      label: "Notifications",
    },
  ];

  const blockedItems = [
    { key: "/settings", icon: <SettingOutlined />, label: "Account Status" },
  ];

  const menuItems = blocked
    ? blockedItems
    : role === "admin"
      ? adminItems
      : userItems;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <div className={style.sidebar_container}>
      <div>
        <div className={style.sidebar_header}>
          <img
            src="/Logo.png"
            alt="EventX Logo"
            className={style.sidebar_logo}
          />
          <h2 className={style.sidebar_title}>EventX</h2>
        </div>

        <div className={style.sidebar_menu}>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className={style.antd_menu}
          />
        </div>
      </div>

      <div className={style.sidebar_footer}>
        <Button className={style.logout_button} onClick={handleLogout}>
          <LogoutOutlined />
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
