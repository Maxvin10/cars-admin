import React, { useEffect } from "react";
import { Button, Card, Form, Input, Typography, Alert, Flex } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthstore } from "../store/auth";

const { Title, Text } = Typography;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{9,}$/;

// Backend: 6–20 belgi,check
const LOGIN_REGEX = /^[a-zA-Z0-9]{6,20}$/;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthstore((s) => s.register);
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
    const { fullName, phoneNumber, email, login, password } = values;
    const result = await register({
      fullName: fullName?.trim(),
      phoneNumber: phoneNumber?.trim(),
      email: email?.trim(),
      login: login?.trim(),
      password,
    });
    if (result.success) {
      if (result.hasToken) {
        navigate("/", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <Flex
      style={{ minHeight: "100vh", background: "#f5f5f5", padding: 24 }}
      align="center"
      justify="center"
      vertical
    >
      <Card
        style={{ width: "100%", maxWidth: 440, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
        bordered={false}
      >
        <Title level={3} style={{ marginBottom: 8, textAlign: "center" }}>
          Ro'yxatdan o'tish
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
          Barcha maydonlarni to'ldiring
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
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="fullName"
            label="To'liq ism"
            rules={[
              { required: true, message: "To'liq ism kiritilishi shart" },
              { whitespace: true, message: "Ism bo'sh bo'lmasin" },
            ]}
          >
            <Input placeholder="Ism Familiya" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Telefon raqam"
            rules={[
              { required: true, message: "Telefon raqam kiritilishi shart" },
              { pattern: PHONE_REGEX, message: "To'g'ri telefon raqam kiriting" },
            ]}
          >
            <Input placeholder="+998 90 123 45 67" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email kiritilishi shart" },
              { type: "email", message: "To'g'ri email kiriting" },
              { pattern: EMAIL_REGEX, message: "To'g'ri email kiriting" },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            name="login"
            label="Login"
            rules={[
              { required: true, message: "Login kiritilishi shart" },
              { min: 6, message: "Login kamida 6 ta belgidan iborat bo'lishi kerak" },
              { max: 20, message: "Login 20 tadan ortiq belgidan iborat bo'lmasin" },
              {
                pattern: LOGIN_REGEX,
                message: "Faqat harflar va raqamlar (6-20 belgi)",
              },
            ]}
          >
            <Input placeholder="Faqat harflar va raqamlar, 6-20 belgi" maxLength={20} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Parol"
            rules={[
              { required: true, message: "Parol kiritilishi shart" },
              { min: 6, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" },
            ]}
          >
            <Input.Password placeholder="Parol" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Parolni tasdiqlang"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Parolni tasdiqlang" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Parollar mos kelmadi"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Parolni qayta kiriting" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              style={{ height: 44 }}
            >
              Ro'yxatdan o'tish
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">Hisobingiz bormi? </Text>
            <Link to="/login">Tizimga kirish</Link>
          </div>
        </Form>
      </Card>
    </Flex>
  );
}
