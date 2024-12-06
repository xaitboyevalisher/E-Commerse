/** @jsxImportSource @emotion/react */
import { Layout, Typography, message, Spin } from "antd";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "@src/types";

const api = axios.create({
  baseURL: "http://54.168.41.60:8080",
});

const Profile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get<User>("/user/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Foydalanuvchi ma'lumotlarini olishda xato:", error);
        message.error(
          "Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi!"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <Layout
        style={{ minHeight: "100vh" }}
        className="flex items-center justify-center"
      >
        <Spin size="large" tip="Yuklanmoqda..." />
      </Layout>
    );
  }

  return (
    <Layout
      css={css`
        min-height: 100vh;
        background-color: #f0f2f5;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={css`
          max-width: 600px;
          width: 100%;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        `}
      >
        <Typography.Title
          level={2}
          css={css`
            text-align: center;
            margin-bottom: 20px;
          `}
        >
          Foydalanuvchi Profili
        </Typography.Title>
        {userData ? (
          <div>
            <p>
              <strong>Foydalanuvchi nomi:</strong> {userData.username}
            </p>
            <p>
              <strong>Ismi:</strong> {userData.firstName}
            </p>
            <p>
              <strong>Familiyasi:</strong> {userData.lastName}
            </p>
            <p>
              <strong>Admin:</strong> {userData.isAdmin ? "Ha" : "Yo'q"}
            </p>
            <p>
              <strong>Manzil:</strong>{" "}
              {userData.address || "Ma'lumot mavjud emas"}
            </p>
            <p>
              <strong>Rasm:</strong>
              {userData.image ? (
                <img
                  src={userData.image.path}
                  alt="Foydalanuvchi rasm"
                  css={css`
                    max-width: 200px;
                    border-radius: 4px;
                    margin-top: 10px;
                  `}
                />
              ) : (
                "Rasm mavjud emas"
              )}
            </p>
          </div>
        ) : (
          <p>Foydalanuvchi ma'lumotlari mavjud emas.</p>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
