/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import {
  Layout,
  Avatar,
  Button,
  Typography,
  Upload,
  Divider,
  Input,
  message,
} from "antd";
import { MdPhotoCamera } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // API calls

const Profile = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [isPasswordChangeVisible, setIsPasswordChangeVisible] = useState(false);
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setName(userName);
    }
  }, []);

  const PhotoUpload = async (info: any) => {
    const file = info.file.originFileObj;

    if (file) {
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await api.post(
          "/api/v1/user/update-profile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          const updatedPhotoPath = response.data.photoPath;
          setProfilePhoto(updatedPhotoPath);
          message.success("Profile photo updated successfully!");
        }
      } catch (error) {
        console.error("Error updating profile photo:", error);
        message.error("An error occurred while updating the photo.");
      }
    }
  };

  const PhotoChange = (file: any) => {
    return false;
  };

  const Logout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const PasswordChange = () => {
    if (newPassword === confirmPassword) {
      console.log("Password changed successfully!");
    } else {
      console.log("Passwords do not match!");
    }
  };

  const NameChange = () => {
    setIsNameEditable(true);
  };

  const NameSave = () => {
    setIsNameEditable(false);
    console.log("Name updated to:", name);
  };

  const PasswordClick = () => {
    setIsPasswordChangeVisible(!isPasswordChangeVisible);
  };

  return (
    <Layout
      css={css`
        min-height: 100vh;
        background: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={css`
          max-width: 400px;
          width: 100%;
          padding: 20px;
          background: white;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        `}
      >
        <Avatar
          size={100}
          src={profilePhoto}
          css={css`
            margin-bottom: 16px;
            background-color: #f0f0f0;
          `}
        />
        <Typography.Title
          level={4}
          css={css`
            margin-bottom: 8px;
          `}
        >
          {name}
        </Typography.Title>

        <Upload
          showUploadList={false}
          beforeUpload={PhotoChange}
          onChange={PhotoUpload}
          accept="image/*"
        >
          <Button type="link" icon={<MdPhotoCamera />}>
            Change profile photo
          </Button>
        </Upload>

        <Divider />

        <div
          css={css`
            text-align: left;
            font-size: 16px;
          `}
        >
          <Typography.Title level={5}>Account Settings</Typography.Title>
          <div
            css={css`
              margin-bottom: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
            `}
            onClick={NameChange}
          >
            <span>Name</span>
            <span>➔</span>
          </div>
          {isNameEditable && (
            <div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                css={css`
                  margin-top: 8px;
                `}
              />
              <Button
                type="primary"
                onClick={NameSave}
                css={css`
                  margin-top: 8px;
                `}
              >
                Save
              </Button>
            </div>
          )}
        </div>

        <Divider />

        <div
          css={css`
            text-align: left;
            font-size: 16px;
          `}
        >
          <Typography.Title
            level={5}
            css={css`
              margin-bottom: 16px;
            `}
          >
            Password Settings
          </Typography.Title>
          <div
            css={css`
              margin-bottom: 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;
            `}
            onClick={PasswordClick}
          >
            <span>Change Password</span>
            <span
              css={css`
                cursor: pointer;
                color: ${isPasswordChangeVisible ? "#1890ff" : "#000"};
              `}
            >
              ➔
            </span>
          </div>

          {isPasswordChangeVisible && (
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 12px;
              `}
            >
              <Input.Password
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Input.Password
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input.Password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                type="primary"
                onClick={PasswordChange}
                css={css`
                  margin-top: 12px;
                `}
              >
                Change Password
              </Button>
            </div>
          )}

          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 16px;
            `}
          >
            <Button
              type="text"
              icon={<FiLogOut size={18} />}
              onClick={Logout}
              css={css`
                color: red;
              `}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
