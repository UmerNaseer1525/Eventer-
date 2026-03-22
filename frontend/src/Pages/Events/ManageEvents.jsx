import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { rejectRequest, approveRequest } from "../../Services/requestSlice";
import { addEvent } from "../../Services/eventSlice";

function ManageEvents() {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);
  function handleReject(recordId) {
    dispatch(rejectRequest({ id: recordId, approvedStatus: "Rejected" }));
  }
  function handleApprove(record) {
    record = { ...record, approvedStatus: "Accepted" };
    dispatch(addEvent(record));
    dispatch(approveRequest(record.id));
  }
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "15%",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: "20%",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      width: "20%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "25%",
      render: (record) => {
        return (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button
              icon={<CloseOutlined />}
              type="default"
              danger
              style={{ minWidth: 100, fontWeight: 500 }}
              onClick={() => handleReject(record.id)}
            >
              Reject
            </Button>
            <Button
              icon={<CheckOutlined />}
              type="primary"
              style={{ minWidth: 100, fontWeight: 500 }}
              onClick={() => handleApprove(record)}
            >
              Approve
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Table
      dataSource={requests}
      columns={columns}
      pagination={false}
      style={{ width: "100%" }}
      scroll={{ x: true }}
    />
  );
}

export default ManageEvents;
