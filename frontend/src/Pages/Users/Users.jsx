import { useRef, useState, useEffect } from "react";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Input,
  Space,
  Table,
  notification,
  Spin,
} from "antd";
import Highlighter from "react-highlight-words";
import style from "./users.module.css";
import UserProfile from "../../Components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, updateUserStatus } from "../../Services/userSlice";

function Users() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  console.log(users);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loadingUserEmail, setLoadingUserEmail] = useState(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchInput = useRef(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText("");
  }

  async function handleStatusChange(email, newStatus) {
    setLoadingUserEmail(email);
    try {
      await dispatch(updateUserStatus(email, newStatus));
      notification.success({
        message: `User status updated`,
        description: `User has been ${newStatus === "blocked" ? "blocked" : "activated"}.`,
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        message: `Failed to update status`,
        description: error.message || "An error occurred.",
        placement: "topRight",
      });
    } finally {
      setLoadingUserEmail(null);
    }
  }

  function renderHighlight(text, dataIndex) {
    return searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    );
  }

  function getColumnSearchProps(dataIndex, getValueFn) {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button type="link" size="small" onClick={() => close()}>
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const fieldValue = getValueFn ? getValueFn(record) : record[dataIndex];
        return fieldValue
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      },
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) setTimeout(() => searchInput.current?.select(), 100);
        },
      },
    };
  }

  const columns = [
    {
      title: "Name",
      key: "name",
      ...getColumnSearchProps("name", (r) => `${r.firstName} ${r.lastName}`),
      render: (_, record) => {
        const fullName = `${record.firstName} ${record.lastName}`;
        const isHighlighted = searchedColumn === "name";
        return (
          <Space>
            <Avatar src={record.profileImage} size={36} />
            {isHighlighted ? (
              <Highlighter
                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={fullName}
              />
            ) : (
              <span>{fullName}</span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ...getColumnSearchProps("username"),
      render: (text) => renderHighlight(text, "username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      render: (text) => renderHighlight(text, "email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      render: (text) => renderHighlight(text, "phone"),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => {
        return (
          <div className={style.action_btns}>
            <Button title="Delete the User">
              <DeleteOutlined style={{ color: "red" }} />
            </Button>
            <Button
              title="View Detail"
              onClick={() => {
                setIsUserProfileOpen(true);
                setSelectedUser(record);
              }}
            >
              <EyeOutlined style={{ color: "gray" }} />
            </Button>
            <Button
              onClick={() =>
                handleStatusChange(
                  record.email,
                  record.status === "active" ? "blocked" : "active",
                )
              }
              title={record.status === "active" ? "Block" : "Unblock"}
              disabled={loadingUserEmail === record.email}
            >
              {loadingUserEmail === record.email ? (
                <Spin size="small" />
              ) : record.status === "active" ? (
                <StopOutlined style={{ color: "red" }} />
              ) : (
                <CheckCircleOutlined style={{ color: "green" }} />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "20px" }}>Users</h1>
      <Card>
        <Table
          columns={columns}
          dataSource={Array.isArray(users) ? users : []}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
      {selectedUser && (
        <UserProfile
          userDetail={selectedUser}
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default Users;
