/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Layout, Form, Input, Button, Typography, Avatar, Upload } from "antd";
import { MdPhotoCamera } from "react-icons/md"; // Foto yuklash ikona
import { FaEdit, FaUser } from "react-icons/fa"; // Edit va User ikonalar
import { css } from "@emotion/react";

const Profile = () => {
  const [form] = Form.useForm();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const handlePhotoUpload = (info: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfilePhoto(reader.result as string);
      }
    };
    reader.readAsDataURL(info.file.originFileObj);
  };

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    // API chaqiruvini shu yerda bajarishingiz mumkin
  };

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
          max-width: 400px;
          width: 100%;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        `}
      >
        <Typography.Title
          level={3}
          css={css`
            text-align: center;
            margin-bottom: 20px;
          `}
        >
          Edit Profile
        </Typography.Title>

        <div
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          `}
        >
          <Avatar
            size={100}
            icon={<FaUser />}
            src={profilePhoto}
            css={css`
              margin-bottom: 10px;
            `}
          />
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handlePhotoUpload}
          >
            <Button type="link" icon={<MdPhotoCamera />}>
              Change profile photo
            </Button>
          </Upload>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: "Bill Smith",
            username: "bill_smith83",
            pronouns: "he/him",
            bio: "I’m a freelance photographer!",
            links: "",
          }}
        >
          <Form.Item label="Name" name="name">
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item label="Username" name="username">
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item label="Pronouns" name="pronouns">
            <Input placeholder="Enter your pronouns" />
          </Form.Item>
          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={2} placeholder="Write your bio" />
          </Form.Item>
          <Form.Item label="Links" name="links">
            <Input placeholder="Add links" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<FaEdit />}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default Profile;
