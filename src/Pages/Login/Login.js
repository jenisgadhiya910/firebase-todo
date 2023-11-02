import React from "react";
import { Form, Input, Button, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useUserAuth } from "../../Context/UserAuthContext";
import "./Login.scss";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const navigate = useNavigate();
  const { logIn,loading } = useUserAuth();
  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      await logIn(email, password);
      navigate("/");
    } catch (err) {
      notification.error({ message: err?.message });
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <h2>Login</h2>
        <Form size="large" name="login" onFinish={onFinish}>
          <Form.Item
            name="email"
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
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        Don't have an account <a href="/auth/signup">register now!</a>
      </div>
    </div>
  );
};

export default LoginPage;
