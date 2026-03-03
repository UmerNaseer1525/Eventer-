import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import style from "./dashboard.module.css";

function Dashboard() {
  return (
    <div className={style.dashboardContainer}>
      <div className={style.header}>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your events today.</p>
      </div>

      <Row gutter={[24, 24]} className={style.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={style.statCard}>
            <Statistic
              title="Total Events"
              value={125}
              prefix={<CalendarOutlined className={style.iconPrimary} />}
              valueStyle={{ color: "#1682B4" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={style.statCard}>
            <Statistic
              title="Total Users"
              value={1893}
              prefix={<UserOutlined className={style.iconSuccess} />}
              valueStyle={{ color: "#28a745" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={style.statCard}>
            <Statistic
              title="Revenue"
              value={45320}
              prefix={<DollarOutlined className={style.iconWarning} />}
              precision={2}
              valueStyle={{ color: "#ffc107" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={style.statCard}>
            <Statistic
              title="Growth"
              value={23.5}
              prefix={<RiseOutlined className={style.iconDanger} />}
              suffix="%"
              valueStyle={{ color: "#dc3545" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className={style.contentRow}>
        <Col xs={24} lg={16}>
          <Card title="Recent Events" className={style.contentCard}>
            <div className={style.eventList}>
              <p>Your recent events will appear here...</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Quick Actions" className={style.contentCard}>
            <div className={style.quickActions}>
              <p>Quick action buttons will appear here...</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
