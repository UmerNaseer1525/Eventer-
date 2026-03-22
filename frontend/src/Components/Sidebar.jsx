import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
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

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    {
      key: "/admin-dashboard",
      icon: <DashboardOutlined />,
      label: "Admin Dashboard",
    },
    { key: "/events", icon: <ScheduleOutlined />, label: "Manage Events" },
    { key: "/my-events", icon: <ScheduleOutlined />, label: "My Events" },
    { key: "/analytics", icon: <BarChartOutlined />, label: "Analytics" },
    { key: "/users", icon: <UserOutlined />, label: "Users" },
    { key: "/admin-profile", icon: <UserOutlined />, label: "Admin Profile" },
    { key: "/my-profile", icon: <UserOutlined />, label: "My Profile" },
    {
      key: "/manage-events",
      icon: <ScheduleOutlined />,
      label: "Admin Manage Events",
    },
    { key: "/manage-users", icon: <UserOutlined />, label: "Manage Users" },
    {
      key: "/manage-categories",
      icon: <AppstoreOutlined />,
      label: "Manage Categories",
    },
    {
      key: "/manage-bookings",
      icon: <CreditCardOutlined />,
      label: "Bookings & Payments",
    },
    { key: "/categories", icon: <AppstoreOutlined />, label: "Categories" },
    { key: "/bookings", icon: <CalendarOutlined />, label: "Bookings" },
    { key: "/payments", icon: <CreditCardOutlined />, label: "Payments" },
    { key: "/reports", icon: <BarChartOutlined />, label: "Reports" },
    { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
    {
      key: "/notifications",
      icon: <NotificationOutlined />,
      label: "Notifications",
    },
  ];

  const handleLogout = () => {
    logout(); // Clear token and user data from localStorage
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
