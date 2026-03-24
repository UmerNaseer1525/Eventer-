import { Modal, List, Tag, Typography, Empty, Space } from "antd";
import { useSelector } from "react-redux";

function EventApprovalQueue({ open, onClose }) {
  const requests = useSelector((state) => state.request);

  // Filter for pending or rejected events
  const queue = requests.filter(
    (event) =>
      event.approvedStatus === "Pending" || event.approvedStatus === "Rejected",
  );

  return (
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
                    <Typography.Text strong>{event.name}</Typography.Text>
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
                      Location: {event.location} | Guests:{" "}
                      {event.number_of_guests}
                    </Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      Contact: {event.contact}
                    </Typography.Text>
                  </>
                }
              />
              <Typography.Paragraph ellipsis={{ rows: 2 }}>
                {event.description || "No description provided."}
              </Typography.Paragraph>
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
}

export default EventApprovalQueue;
