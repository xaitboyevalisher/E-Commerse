/** @jsxImportSource @emotion/react */
import { Layout, Form, Input, Button, Typography, message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://54.168.41.60:8080",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const Login = async (values: { username: string; password: string }) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: values.username,
        password: values.password,
      });

      if (response.status === 200) {
        const { accessToken, roles } = response.data;

        // Tokenni saqlash
        localStorage.setItem("token", accessToken);
        localStorage.setItem("isLoggedIn", "true");

        message.success("Muvaffaqiyatli kirish!");

        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else if (roles.includes("ROLE_USER")) {
          navigate("/");
        } else {
          message.error("Sizning rolingiz aniqlanmadi.");
        }
      } else {
        message.error(
          "Kirish muvaffaqiyatsiz. Iltimos, qaytadan urinib ko'ring."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          message.error("Tizimga kirish ro'yxatdan o'ting.");
        } else {
          message.error(
            "Kirishda xatolik yuz berdi: " + error.response.data.message
          );
        }
      } else {
        console.error("Kirishda xato", error);
        message.error("Kirishda xatolik yuz berdi!");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token topilmadi, login sahifasiga yo'naltiryapmiz...");
      navigate("/login");
    } else {
      console.log("Token mavjud:", token);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Layout
      style={{ minHeight: "100vh" }}
      className="flex items-center justify-center"
    >
      <div style={{ maxWidth: 400, width: "100%", padding: 20 }}>
        <Typography.Title level={2} className="text-center mb-4">
          Tizimga Kirish
        </Typography.Title>
        <Form onFinish={Login} layout="vertical">
          <Form.Item
            name="username"
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
          <Form.Item>
            <div style={{ textAlign: "center" }}>
              <Typography.Text>
                Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
              </Typography.Text>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default LoginPage;
