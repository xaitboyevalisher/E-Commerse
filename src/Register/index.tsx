import { Layout, Form, Input, Button, Typography, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api"; // `register` funksiyasini import qilish

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);

    try {
      await register(values);

      localStorage.setItem("userName", values.name);

      message.success("Ro'yxatdan o'tish muvaffaqiyatli!");
      navigate("/login");
    } catch (error) {
      console.error("Ro'yxatdan o'tishda xatolik:", error);
      message.error(
        "Ro'yxatdan o'tishda xatolik yuz berdi! Iltimos, qayta urinib ko'ring."
      );
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
        <Typography.Title level={2} className="text-center mb-4">
          Ro'yxatdan O'tish
        </Typography.Title>
        <Form onFinish={handleRegister} layout="vertical">
          <Form.Item
            name="name"
            label="Ism"
            rules={[{ required: true, message: "Ismingizni kiriting!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email manzilingizni kiriting!" },
              { type: "email", message: "Email formati noto'g'ri!" },
            ]}
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
              Ro'yxatdan O'tish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default Register;
