import React, { useEffect } from "react";
import { Button, Card, Form, Input, Typography, Alert, Flex } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthstore } from "../store/auth";

const { Title, Text } = Typography;

// Backend: 6–20 belgi, faqat harflar va raqamlar
const LOGIN_REGEX = /^[a-zA-Z0-9]{6,20}$/;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthstore((s) => s.login);
  const isLoading = useAuthstore((s) => s.isLoading);
  const error = useAuthstore((s) => s.error);
  const clearError = useAuthstore((s) => s.clearError);
  const token = useAuthstore((s) => s.token);

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const onFinish = async (values) => {
    const { success } = await login(values);
    if (success) navigate("/", { replace: true });
  };

  return (
    <Flex
      style={{ minHeight: "100vh", background: "#f5f5f5" }}
      align="center"
      justify="center"
      vertical
    >
      <Card
        style={{ width: "100%", maxWidth: 400, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
        bordered={false}
      >
        <Title level={3} style={{ marginBottom: 8, textAlign: "center" }}>
          Tizimga kirish
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
          Login va parolingizni kiriting
        </Text>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            style={{ marginBottom: 16 }}
            onClose={clearError}
          />
        )}

        <Form
          {...layout}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="login"
            label="Login"
            rules={[
              { required: true, message: "Login kiritilishi shart" },
              { min: 6, message: "Login kamida 6 ta belgi" },
              { max: 20, message: "Login 20 tadan ortiq bo‘lmasin" },
              {
                pattern: LOGIN_REGEX,
                message: "Faqat harflar va raqamlar (6–20 belgi)",
              },
            ]}
          >
            <Input placeholder="Login (6–20 belgi, harflar va raqamlar)" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            rules={[
              { required: true, message: "Parol kiritilishi shart" },
              { min: 4, message: "Parol kamida 4 ta belgidan iborat bo'lishi kerak" },
            ]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              style={{ height: 44 }}
            >
              Kirish
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">Hisobingiz yo‘qmi? </Text>
            <Link to="/register">Ro‘yxatdan o‘tish</Link>
          </div>
        </Form>
      </Card>
    </Flex>
  );
}
