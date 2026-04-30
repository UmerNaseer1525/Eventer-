import {
  Form,
  Input,
  Modal,
  Select,
  Button,
  notification,
  DatePicker,
} from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addEvent } from "../Services/eventSlice";

export default function CreateEvent({ isOpen, onModalClose }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const dateTime = values.date;
    const date = dateTime.format("YYYY-MM-DD");
    const time = dateTime.format("HH:mm");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const organizerId = storedUser?._id || storedUser?.id;

    setLoading(true);
    try {
      if (!organizerId) {
        throw new Error("Unable to determine the logged-in user.");
      }

      const newEvent = {
        ...values,
        organizer: organizerId,
        status: "upcoming",
        isApproved: "pending",
        date,
        time,
      };

      await dispatch(addEvent(newEvent));
      notification.success({
        title: "Event Created",
        description: "Your event has been created and is pending approval.",
      });
      form.resetFields();
      onModalClose();
      setLoading(false);
    } catch (error) {
      notification.error({
        title: "Create Event Failed",
        description: error.message || "Unable to create event.",
      });
      setLoading(false);
    }
  };

  const disabledDate = (current) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return current && current.toDate() < today;
  };

  return (
    <Modal
      title="Create New Event"
      open={isOpen}
      onCancel={onModalClose}
      footer={[
        <Button key="cancel" onClick={onModalClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Create Event
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Event Title"
          rules={[
            { required: true, message: "Please enter the event title" },
            {
              pattern: /^[a-zA-Z0-9 ]+$/,
              message: "Title cannot contain special characters",
            },
          ]}
        >
          <Input placeholder="e.g. SOFTECH" />
        </Form.Item>

        <Form.Item
          name={"description"}
          label="Event Detail"
          rules={[{ required: true, message: "Please enter event detail" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="event related information including rules and regulations"
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            allowClear
            placeholder="Select category"
            options={[
              { value: "Conference", label: "Conference" },
              { value: "Concert", label: "Music Concert" },
              { value: "Meetup", label: "Meetup" },
              { value: "Workshop", label: "Workshop" },
              { value: "Exhibition", label: "Exhibition" },
              { value: "Sports", label: "Sports" },
              { value: "Festival", label: "Festival" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          rules={[
            { required: true, message: "Please enter the location" },
            {
              pattern: /^[a-zA-Z0-9, ]+$/,
              message:
                "Location cannot contain special characters (commas allowed)",
            },
          ]}
        >
          <Input placeholder="e.g. London" />
        </Form.Item>

        <Form.Item
          name={"date"}
          label="Date of Event"
          rules={[{ required: true, message: "Please enter date of event" }]}
        >
          <DatePicker
            format={["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"]}
            style={{ width: "100%" }}
            disabledDate={disabledDate}
            showTime
          />
        </Form.Item>
        <Form.Item
          name={"capacity"}
          label="Capacity"
          rules={[
            { required: true, message: "Please enter event capacity" },
            {
              pattern: /^[0-9]+$/,
              message: "Only numbers are allowed",
            },
          ]}
        >
          <Input
            type="number"
            min={1}
            placeholder="e.g. 100"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="bannerImage"
          label="Banner Image URL"
          initialValue="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          rules={[
            { required: false },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input placeholder="Enter image URL from Unsplash or similar" />
        </Form.Item>

        <Form.Item
          name="ticketPrice"
          label="Ticket Price"
          rules={[
            { required: true, message: "Please enter the ticket price" },
            {
              pattern: /^[0-9]+$/,
              message: "Only numbers are allowed",
            },
          ]}
        >
          <Input
            type="number"
            min={0}
            placeholder="e.g. 500"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
