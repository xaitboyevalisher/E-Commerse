/** @jsxImportSource @emotion/react */
import { Layout, Form, Input, Button, Typography, message, Space } from "antd";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const { Title, Text } = Typography;

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const response = await api.post("/api/v1/auth/sign-in", {
        email: values.email,
        password: values.password,
      });

      if (response.data.success) {
        const { accessToken } = response.data.data.token;
        const { name } = response.data.data.user;

        sessionStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userName", name);

        message.success("Muvaffaqiyatli kirish!");
        navigate("/");
      }
    } catch (error) {
      message.error("Login yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{ minHeight: "100vh" }}
      className="flex items-center justify-center"
    >
      <div style={{ maxWidth: 400, width: "100%", padding: 20 }}>
        <Title level={2} className="text-center mb-4">
          Tizimga Kirish
        </Title>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Emailni kiriting!" },
              { type: "email", message: "Email formatini to'g'ri kiriting!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Parol"
            rules={[
              { required: true, message: "Parolni kiriting!" },
              {
                min: 6,
                message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Kirish
            </Button>
          </Form.Item>
        </Form>

        <Space className="w-full justify-center">
          <Text>
            Hisobingiz yo'qmi?{" "}
            <Link to="/register" className="text-blue-500">
              Ro'yxatdan o'tish
            </Link>
          </Text>
        </Space>
      </div>
    </Layout>
  );
};

export default LoginPage;
