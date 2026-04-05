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
import { updateApprovedStatus } from "../Services/eventSlice";
import { addRequest } from "../Services/requestSlice";

function EventApprovalQueue({ open, onClose }) {
  const events = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState({ open: false, event: null });

  const queue = events.filter(
    (event) =>
      event.approvedStatus === "Pending" || event.approvedStatus === "Rejected",
  );

  const handleRequestAgain = (eventId) => {
    console.log(eventId);
    dispatch(addRequest({ eventId: eventId }));
    dispatch(updateApprovedStatus({ id: eventId }));
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
            renderItem={(event) => (
              <List.Item key={event.id}>
                <List.Item.Meta
                  title={
                    <Space>
                      <Typography.Text strong>{event.title}</Typography.Text>
                      <Tag color="purple">{event.category}</Tag>
                      <Tag color="blue">{event.status}</Tag>
                      {event.approvedStatus === "Pending" && (
                        <Tag color="gold">Pending Approval</Tag>
                      )}
                      {event.approvedStatus === "Rejected" && (
                        <Tag color="red">Rejected</Tag>
                      )}
                    </Space>
                  }
                  description={
                    <>
                      <Typography.Text type="secondary">
                        Location: {event.location} | Capacity: {event.capacity}
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
                {event.approvedStatus === "Rejected" && (
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
                        onClick={() => handleRequestAgain(event.id)}
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
            )}
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
