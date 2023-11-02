import React from "react";
import { Form, Input, Button, Select, Upload } from "antd";
import "./Signup.scss";
import { useNavigate } from "react-router";
import { useUserAuth } from "../../Context/UserAuthContext";
import { UploadOutlined } from "@ant-design/icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useUserAuth();
  const loading = false;

  const onFinish =async (values) => {
    const avatarFile = values?.avatar?.file;
    let avatarUrl = '';
    if (avatarFile) {
      const avatarRef = ref(storage, "avatar");
      await uploadBytes(avatarRef, avatarFile)
      avatarUrl = await getDownloadURL(avatarRef)
    }
    signUp({ ...values, avatar: avatarUrl || '' });
  };

  const passwordValidator = (_, value) => {
    if (value && value.length < 8) {
      return Promise.reject(
        new Error("Password must be at least 8 characters")
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        <h2>Signup</h2>
        <Form size="large" name="signup" onFinish={onFinish}>
          <Form.Item
            name="first_name"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter your first name",
              },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="last_name"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter your last name",
              },
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            name="email"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter your email",
              },
              {
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="role"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter your role",
              },
            ]}
          >
            <Select placeholder="Select a role">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
              {
                validator: passwordValidator,
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item name="avatar">
            <Upload
              listType="picture"
              action={null}
              multiple={false}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Avatar</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="signup-form-button"
            >
              Signup
            </Button>
          </Form.Item>
        </Form>
        If you have already an account <a href="/auth/login">Login</a>
      </div>
    </div>
  );
};

export default SignupPage;
