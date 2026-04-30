import {
  Modal,
  List,
  Tag,
  Typography,
  Empty,
  Space,
  Button,
  Alert,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import EditEvent from "./EditEvent";
import { resetApprovalAsync } from "../Services/eventSlice";
import { addRequest } from "../Services/requestSlice";

function EventApprovalQueue({ open, onClose }) {
  const pendingEvents = useSelector((state) => state.event.pendingAprovalEvents);
  const rejectedEvents = useSelector((state) => state.event.rejectedEvents);
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState({ open: false, event: null });

  const allPendingAndRejected = [
    ...(Array.isArray(pendingEvents) ? pendingEvents : []),
    ...(Array.isArray(rejectedEvents) ? rejectedEvents : []),
  ];

  const queue = allPendingAndRejected.filter((event) => {
    if (!event) {
      return false;
    }
    const value = String(event?.isApproved ?? "").toLowerCase();
    return value === "" || value === "pending" || value === "rejected";
  });

  const handleRequestAgain = (eventId) => {
    dispatch(
      addRequest({
        eventId,
        type: "eventApproval",
        status: "pending",
      }),
    );
    dispatch(resetApprovalAsync(eventId));
  };

  return (
    <>
      <Modal
        title="Event Approval Queue"
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        {queue.length === 0 ? (
          <Empty description="No events in approval queue." />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={queue}
            renderItem={(event) => {
              const value = String(event?.isApproved ?? "").toLowerCase();
              const approvalStatus =
                value === "rejected"
                  ? "Rejected"
                  : value === "approved" || value === "true"
                    ? "Approved"
                    : "Pending";

              return (
                <List.Item key={event._id}>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Typography.Text strong>{event.title}</Typography.Text>
                        <Tag color="purple">{event.category}</Tag>
                        <Tag color="blue">{event.status}</Tag>
                        {approvalStatus === "Pending" && (
                          <Tag color="gold">Pending Approval</Tag>
                        )}
                        {approvalStatus === "Rejected" && (
                          <Tag color="red">Rejected</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <>
                        <Typography.Text type="secondary">
                          Location: {event.location} | Capacity:{" "}
                          {event.capacity}
                        </Typography.Text>
                        <br />
                        <Typography.Text type="secondary">
                          Ticket Price:{" "}
                          {event.ticketPrice ? `Rs. ${event.ticketPrice}` : "-"}
                        </Typography.Text>
                      </>
                    }
                  />
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {event.description || "No description provided."}
                  </Typography.Paragraph>
                  {approvalStatus === "Rejected" && (
                    <>
                      <Alert
                        title="Rejection Reason"
                        description={event.reason || "No reason provided."}
                        type="error"
                        showIcon
                        style={{ marginBottom: 12 }}
                      />
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => handleRequestAgain(event._id)}
                        >
                          Request Again
                        </Button>
                        <Button
                          onClick={() => setEditModal({ open: true, event })}
                        >
                          Edit
                        </Button>
                      </Space>
                    </>
                  )}
                </List.Item>
              );
            }}
          />
        )}
      </Modal>
      <EditEvent
        isOpen={editModal.open}
        onModalClose={() => setEditModal({ open: false, event: null })}
        record={editModal.event}
      />
    </>
  );
}

export default EventApprovalQueue;
