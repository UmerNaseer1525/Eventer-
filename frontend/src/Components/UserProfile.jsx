import React from "react";
import { Card, Avatar, Typography, Button, Row, Col, Tag, Modal } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import eventerIcon from "../assets/Logo.png";

const { Title, Text } = Typography;

function UserProfile({ userDetail, isOpen, onClose }) {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={370}
      closeIcon={false}
      bodyStyle={{ padding: 0, borderRadius: 18, overflow: "hidden" }}
    >
      <Card
        style={{
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          paddingTop: 0,
          position: "relative",
          marginBottom: 0,
        }}
        bodyStyle={{
          paddingTop: 60,
          paddingBottom: 24,
          paddingLeft: 24,
          paddingRight: 24,
        }}
        cover={
          <div
            style={{
              position: "relative",
              height: 140,
              background: "linear-gradient(120deg, #1677ff 0%, #005bea 100%)",
            }}
          >
            <img
              src={userDetail.backgroundImage || eventerIcon}
              alt="Background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.22,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <Avatar
              src={userDetail.profileImage}
              size={96}
              style={{
                position: "absolute",
                left: "50%",
                bottom: -48,
                transform: "translateX(-50%)",
                border: "4px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                background: "#fff",
              }}
            />
          </div>
        }
      >
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            {`${userDetail.firstName || ""} ${userDetail.lastName || ""}`.trim()}
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            {userDetail.username}
          </Text>
          <div style={{ margin: "10px 0 0 0" }}>
            <Text style={{ display: "block", color: "#888" }}>
              {userDetail.email}
            </Text>
            <Text style={{ display: "block", color: "#888" }}>
              {userDetail.phone}
            </Text>
          </div>

          <Button
            type="primary"
            block
            size="large"
            style={{
              background: "linear-gradient(90deg, #1677ff 0%, #005bea 100%)",
              borderRadius: 24,
              fontWeight: 500,
              fontSize: 16,
              marginTop: 8,
            }}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Card>
    </Modal>
  );
}

export default UserProfile;
