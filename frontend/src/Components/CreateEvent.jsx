import { Form, Input, Modal, Select, Button, notification, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addEvent } from "../Services/eventSlice";

export default function CreateEvent({ isOpen, onModalClose }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newEvent = {
        ...values,
        id: Date.now(),
        status: "Upcoming",
        isApproved: false,
      };

      dispatch(addEvent(newEvent));
      notification.success({
        title: "Event Created",
        description: "Your event has been created and is pending approval.",
      });
      form.resetFields();
      onModalClose();
      setLoading(false);
    }, 1000);
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
          name="name"
          label="Event Name"
          rules={[
            { required: true, message: "Please enter the event name" },
            {
              pattern: /^[a-zA-Z0-9 ]+$/,
              message: "Name cannot contain special characters",
            },
          ]}
        >
          <Input placeholder="e.g. SOFTECH" />
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
              message: "Location cannot contain special characters (commas allowed)",
            },
          ]}
        >
          <Input placeholder="e.g. London" />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Contact Number"
          rules={[
            { required: true, message: "Please enter the contact number" },
            {
              pattern: /^\+?[0-9]+$/,
              message: "Only numbers and '+' are allowed",
            },
          ]}
        >
          <Input placeholder="e.g. 03024200127" />
        </Form.Item>

        <Form.Item
          name="cover"
          label="Cover Image URL"
          initialValue="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          rules={[
            { required: true, message: "Please provide a cover image URL" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input placeholder="Enter image URL from Unsplash or similar" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

