/** @jsxImportSource @emotion/react */
import { Layout, Form, Input, Button, Typography, message, Space } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom"; // Link komponentini import qilish

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://8.210.211.217:8080/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const response = await api.post("/api/v1/auth/sign-in", {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        const { accessToken } = response.data;
        sessionStorage.setItem("accessToken", accessToken); // Tokenni sessionStorage'ga saqlash
        message.success("Muvaffaqiyatli kirish!");
        navigate("/"); // Asosiy sahifaga o'tish
      }
    } catch (error) {
      message.error("Login yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) navigate("/"); // Agar token mavjud bo'lsa, asosiy sahifaga o'tadi
  }, [navigate]);

  return (
    <Layout
      style={{ minHeight: "100vh" }}
      className="flex items-center justify-center"
    >
      <div style={{ maxWidth: 400, width: "100%", padding: 20 }}>
        <Typography.Title level={2} className="text-center mb-4">
          Tizimga Kirish
        </Typography.Title>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            label="Login"
            rules={[{ required: true, message: "Loginni kiriting!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Parol"
            rules={[{ required: true, message: "Parolni kiriting!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Kirish
            </Button>
          </Form.Item>
        </Form>

        {/* Hisobingiz yo'qmi? ro'yxatdan o'tish havolasi */}
        <Space className="w-full justify-center">
          <Typography.Text>
            Hisobingiz yo'qmi?{" "}
            <Link to="/register" className="text-blue-500">
              Ro'yxatdan o'tish
            </Link>
          </Typography.Text>
        </Space>
      </div>
    </Layout>
  );
};

export default LoginPage;
