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
        ...values,
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
          <Input placeholder="YYYY-MM-DD" />
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
