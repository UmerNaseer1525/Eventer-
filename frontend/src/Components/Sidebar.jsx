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
import { Button } from "antd";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./sidebar.module.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { path: "/events", icon: <ScheduleOutlined />, label: "Manage Events" },
    { path: "/users", icon: <UserOutlined />, label: "Users" },
    { path: "/categories", icon: <AppstoreOutlined />, label: "Categories" },
    { path: "/bookings", icon: <CalendarOutlined />, label: "Bookings" },
    { path: "/payments", icon: <CreditCardOutlined />, label: "Payments" },
    { path: "/reports", icon: <BarChartOutlined />, label: "Reports" },
    { path: "/settings", icon: <SettingOutlined />, label: "Settings" },
    {
      path: "/notifications",
      icon: <NotificationOutlined />,
      label: "Notifications",
    },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/signin");
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
          {menuItems.map((item) => (
            <Button
              key={item.path}
              type="default"
              className={`${style.menu_button} ${
                location.pathname === item.path ? style.menu_button_active : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Button>
          ))}
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
