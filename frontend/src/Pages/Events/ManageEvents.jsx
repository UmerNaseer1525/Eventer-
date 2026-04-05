import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Input, Modal, notification, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { removeRequest } from "../../Services/requestSlice";
import { eventApproved, eventRejected } from "../../Services/eventSlice";
import { useState } from "react";

function ManageEvents() {
  const [rejectionReason, setRejectonReason] = useState("");
  const [event_id, setEvent_id] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  const events = useSelector((state) => state.event);
  const eventRequests = requests.filter(
    (request) =>
      (request.type === "eventApproval" || request.eventId !== undefined) &&
      (request.status === undefined || request.status === "pending"),
  );
  const matchedEvents = eventRequests
    .map((req) => events.find((event) => event.id === req.eventId))
    .filter((event) => event !== undefined);
  function handleReject(eventId, rejection_reason) {
    if (!rejection_reason || !rejection_reason.trim()) {
      notification.error({
        message: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
      });
      return;
    }
    setLoadingId(eventId);
    setTimeout(() => {
      setIsModalOpen(false);
      dispatch(
        eventRejected({
          id: eventId,
          reason: rejection_reason,
        }),
      );
      dispatch(removeRequest(eventId));
      notification.success({
        title: "Request Rejected",
        description: `You rejected the request. Reason: ${rejection_reason}`,
        duration: 3,
        placement: "topRight",
      });
      setLoadingId(null);
      setRejectonReason("");
    }, 800);
  }
  function handleApprove(eventId) {
    setLoadingId(eventId);
    dispatch(eventApproved({ id: eventId }));
    dispatch(removeRequest(eventId));
    setTimeout(() => {
      notification.success({
        title: "Request Approved",
        description: "You Approved the request.",
        duration: 3,
        placement: "topRight",
      });
      setLoadingId(null);
    }, 800);
  }
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "12%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "12%",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: "12%",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      width: "12%",
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
      width: "12%",
    },
    {
      title: "Ticket Price",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
      width: "12%",
      render: (value) => (value ? `Rs. ${value}` : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "28%",
      render: (record) => {
        return (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button
              icon={<CloseOutlined />}
              type="default"
              danger
              style={{ minWidth: 100, fontWeight: 500 }}
              loading={loadingId === record.id}
              onClick={() => {
                setEvent_id(record.id);
                setIsModalOpen(true);
              }}
            >
              Reject
            </Button>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              style={{ minWidth: 100, fontWeight: 500 }}
              loading={loadingId === record.id}
              onClick={() => handleApprove(record.id)}
            >
              Approve
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Table
        dataSource={matchedEvents}
        columns={columns}
        pagination={false}
        style={{ width: "100%" }}
        scroll={{ x: true }}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => handleReject(event_id, rejectionReason)}
        okText="Reject Request"
        okButtonProps={{ danger: true, loading: loadingId === event_id }}
      >
        <Input.TextArea
          rows={3}
          placeholder="Give rejection reason"
          value={rejectionReason}
          onChange={(e) => setRejectonReason(e.target.value)}
        />
      </Modal>
    </>
  );
}

export default ManageEvents;
