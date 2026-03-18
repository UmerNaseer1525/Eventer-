import { Form, Input, Modal, Select, Button, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateEvent } from "../Services/eventSlice";

export default function EditEvent({ isOpen, onModalClose, record }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [isOpen, record, form]);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      const updated_event = {
        ...record,
        ...values
      };

      dispatch(updateEvent(updated_event));
      notification.success({
        message: "Event Updated",
        description: "Your event has been successfully updated.",
      });
      onModalClose();
      setLoading(false);
    }, 1000);
  };

  return (
    <Modal
      title="Edit Event"
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
          Update Event
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
          rules={[
            { required: true, message: "Please provide a cover image URL" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

