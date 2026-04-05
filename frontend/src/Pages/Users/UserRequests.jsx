import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Card,
  Space,
  Table,
  Tag,
  Typography,
  notification,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { resolveUnblockRequest } from "../../Services/requestSlice";
import { updateUserStatus } from "../../Services/userSlice";

function UserRequests() {
  const dispatch = useDispatch();
  const [busyId, setBusyId] = useState(null);
  const requests = useSelector((state) =>
    Array.isArray(state.request) ? state.request : [],
  );

  const unblockRequests = useMemo(
    () => requests.filter((request) => request.type === "unblock"),
    [requests],
  );

  async function handleApprove(request) {
    setBusyId(request.id);
    try {
      await dispatch(updateUserStatus(request.email, "active"));
      dispatch(
        resolveUnblockRequest({
          id: request.id,
          resolutionStatus: "approved",
          reviewedBy: "admin",
        }),
      );

      notification.success({
        message: "Request Approved",
        description: `${request.email} has been unblocked successfully.`,
      });
    } catch (error) {
      notification.error({
        message: "Approval Failed",
        description: error.message || "Unable to approve unblock request.",
      });
    } finally {
      setBusyId(null);
    }
  }

  function handleReject(request) {
    setBusyId(request.id);
    dispatch(
      resolveUnblockRequest({
        id: request.id,
        resolutionStatus: "rejected",
        reviewedBy: "admin",
      }),
    );
    notification.info({
      message: "Request Rejected",
      description: `Unblock request for ${request.email} was rejected.`,
    });
    setBusyId(null);
  }

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, request) => (
        <div>
          <Typography.Text strong>
            {request.fullName || request.username || "Unknown User"}
          </Typography.Text>
          <div style={{ color: "#888" }}>{request.email || "-"}</div>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (value) => value || "Request to restore account access",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const color =
          value === "approved"
            ? "green"
            : value === "rejected"
              ? "red"
              : "gold";
        return (
          <Tag color={color}>{String(value || "pending").toUpperCase()}</Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, request) => {
        const isPending = request.status === "pending";
        return (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              disabled={!isPending}
              loading={busyId === request.id}
              onClick={() => handleApprove(request)}
            >
              Approve
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              disabled={!isPending}
              loading={busyId === request.id}
              onClick={() => handleReject(request)}
            >
              Reject
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: 20 }}>User Access Requests</h1>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Handle requests from blocked users who asked to be unblocked."
      />
      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={unblockRequests}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
}

export default UserRequests;
