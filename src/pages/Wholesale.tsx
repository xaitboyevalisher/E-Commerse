import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Card,
  Typography,
  Layout,
  Carousel,
  Image,
  message,
} from "antd";
import Header from "../components/Headers";
import Footers from "@src/components/Headers/Footer";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import { ApplicationData } from "../types";

const { Title, Paragraph } = Typography;

const formContainerStyle = css`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  margin-bottom: 40px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const textStyle = css`
  flex: 1;
  padding-right: 20px;
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #666;
    margin-top: 10px;
  }

  @media (min-width: 768px) {
    h2 {
      font-size: 2rem;
    }
  }
`;

const formStyle = css`
  flex: 1;
  padding-left: 0;

  @media (min-width: 768px) {
    padding-left: 20px;
  }
`;

const cardsContainer = css`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;

  .ant-card {
    flex: 1;
    width: 423px;
  }
`;

const featuresContainer = css`
  display: flex;
  align-items: center;
  background-color: #f0f8ff;
  padding: 40px;
  text-align: left;
`;

const featuresContent = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 40px;
  flex: 1;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .feature {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 15px;

    .feature-title {
      font-weight: bold;
      color: #333;
    }

    p {
      font-size: 1rem;
      color: #666;
      width: 85%; 
      word-break: break-word; 
    }

    .rounded-full {
      width: 56px; 
      height: 56px; 
      border-radius: 50%; 
      overflow: hidden; 
      flex-shrink: 0; 
      display: flex;
      align-items: center;
      justify-content: center;
    }

    img {
      width: 24px; 
      height: 24px; 
      object-fit: cover; 
  }
`;

const workSectionStyle = css`
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem; // Increased gap between inputs and button
  margin-top: 1rem;
  flex-wrap: nowrap; // Ensures the button stays on the same line as the inputs
  align-items: center; // Vertically align the button and inputs
`;
const Wholesale = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async (values: any) => {
    const requestData: ApplicationData = {
      name: values.name,
      company: values.company,
      phone: values.phone,
      lockId: 1,
      lockAmount: parseInt(values.quantity, 10) || 1,
      customLogo: values.services?.includes("logo") || false,
      helpSetup: values.services?.includes("help") || false,
    };

    try {
      await api.post("/application/add", requestData, {
        headers: { "Accept-Language": "ru" },
      });
      message.success("Заявка успешно отправлена!");
    } catch (error) {
      console.error(error);
      message.error("Ошибка при отправке заявки!");
    }
  };

  const Submit = async () => {
    const contactData = { name, email };

    try {
      await api.post("/contact/add", contactData);

      localStorage.setItem(
        "contactSuccessMessage",
        "Kontaktingiz muvaffaqiyatli qabul qilindi, tez orada siz bilan bog'lanamiz!"
      );

      message.success(
        localStorage.getItem("contactSuccessMessage") ||
          "Muvaffaqiyatli yuborildi!"
      );

      setName("");
      setEmail("");
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);

      message.error("Xatolik yuz berdi, qayta urinib ko'ring.");
    }
  };

  const { t } = useTranslation();
  const carouselRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const AfterChange = (current: number) => {
    setCurrentSlide(current);
  };

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  useEffect(() => {
    const Resize = () => setIsDesktop(window.innerWidth >= 774);
    window.addEventListener("resize", Resize);
    return () => {
      window.removeEventListener("resize", Resize);
    };
  }, []);

  return (
    <Layout>
      <Header isDesktop={isDesktop} />
      <div css={formContainerStyle}>
        <div css={textStyle}>
          <h2>{t("formTitle")}</h2>
          <p>{t("formDescription")}</p>
        </div>
        <div css={formStyle}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <h3>{t("applicationForm")}</h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label={t("name")}
                  name="name"
                  rules={[{ required: true, message: t("nameRequired") }]}
                >
                  <Input placeholder={t("name")} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label={t("company")}
                  name="company"
                  rules={[{ required: true, message: t("companyRequired") }]}
                >
                  <Input placeholder={t("company")} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label={t("phone")}
                  name="phone"
                  rules={[{ required: true, message: t("phoneRequired") }]}
                >
                  <Input placeholder={t("phone")} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label={t("product")}
                  name="product"
                  rules={[{ required: true, message: t("productRequired") }]}
                >
                  <Input placeholder={t("product")} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label={t("quantity")}
                  name="quantity"
                  rules={[{ required: true, message: t("quantityRequired") }]}
                >
                  <Input placeholder={t("quantity")} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="services">
              <Checkbox.Group>
                <Row>
                  <Col span={24}>
                    <Checkbox value="logo">{t("logoOption")}</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="help">{t("helpOption")}</Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                {t("submitApplication")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div css={workSectionStyle}>
        <Title level={2}>{t("how_we_work.title")}</Title>
        <div css={cardsContainer}>
          <Card>
            <img src="/Shape.png" alt={t("how_we_work.step_1.alt")} />
            <Title level={3}>{t("how_we_work.step_1.title")}</Title>
            <Paragraph className="min-w-[370px]">
              {t("how_we_work.step_1.description")}
            </Paragraph>
          </Card>
          <Card>
            <img src="/Shape (1).png" alt={t("how_we_work.step_2.alt")} />
            <Title level={3}>{t("how_we_work.step_2.title")}</Title>
            <Paragraph className="min-w-[350px]">
              {t("how_we_work.step_2.description")}
            </Paragraph>
          </Card>
          <Card>
            <img src="/Shape (2).png" alt={t("how_we_work.step_3.alt")} />
            <Title level={3}>{t("how_we_work.step_3.title")}</Title>
            <Paragraph className="min-w-[350px]">
              {t("how_we_work.step_3.description")}
            </Paragraph>
          </Card>
        </div>
      </div>
      <div>
        <h1 className="pl-8">Почему стоит выбрать нас</h1>
        <div className="features-container" css={featuresContainer}>
          <img
            src="/Rectangle 804.png"
            alt="Почему стоит выбрать нас"
            width={600}
            height={560}
          />
          <div className="features-content" css={featuresContent}>
            <div className="feature flex gap-4">
              <div className="rounded-full w-14 h-14 flex items-center justify-center">
                <img src="/product-return 1 (2).png" alt="" />
              </div>
              <div>
                <p className="feature-title">Возврат удвоенной стоимости</p>
                <p className="min-w-[390px]">
                  За каждый отправленный товар который окажется бракованным, мы
                  вернем вам двойную стоимость.
                </p>
              </div>
            </div>

            <div className="feature flex gap-4">
              <div className="rounded-full w-14 h-14 flex items-center justify-center">
                <img src="/install 1.png" alt="" />
              </div>
              <div>
                <p className="feature-title">Монтаж</p>
                <p className="min-w-[500px]">
                  Проводим монтажные работы любой сложности и в любое удобное
                  для Вас время.
                </p>
              </div>
            </div>

            <div className="feature flex gap-4">
              <div className="rounded-full w-14 h-14 flex items-center justify-center">
                <img src="/image 1.png" alt="" />
              </div>
              <div>
                <p className="feature-title">Брендирование продукта</p>
                <p className="min-w-[405px]">
                  Мы нанесем Ваш логотип любой сложности на свою продукцию,
                  чтобы прибавить ей эксклюзивности.
                </p>
              </div>
            </div>

            <div className="feature flex gap-4">
              <div className="rounded-full w-14 h-14 flex items-center justify-center">
                <img src="/product-return 1 (2).png" alt="" />
              </div>
              <div>
                <p className="feature-title">Брендирование продукта</p>
                <p className="min-w-[405px]">
                  Мы нанесем Ваш логотип любой сложности на свою продукцию,
                  чтобы прибавить ей эксклюзивности.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Carousel
        autoplay
        ref={carouselRef}
        dots={false}
        afterChange={AfterChange}
      >
        {[1, 2, 3].map((slide) => (
          <div
            key={slide}
            className="border border-gray-200 rounded-lg shadow-lg bg-white p-6"
          >
            <Row gutter={[16, 16]} align="middle">
              <Col
                xs={24}
                md={8}
                className="flex justify-center md:justify-start"
              >
                <Image
                  src="/Image.png"
                  alt="Radisson Hotel"
                  className="rounded-lg shadow-md"
                />
              </Col>

              <Col xs={24} md={16}>
                <div className="flex flex-col justify-start space-y-4">
                  <div className="flex flex-col items-center md:items-start mb-4">
                    <Image
                      src="/radisson-dark 1.png"
                      alt="Radisson Hotels"
                      className="w-32 h-auto"
                      width={128}
                      height={32}
                    />
                    <h3 className="text-xl font-semibold text-center md:text-left mt-4">
                      Проект для гостиницы Radisson Hotels
                    </h3>
                  </div>

                  <Row className="space-y-4">
                    <Col span={24}>
                      <Checkbox defaultChecked className="mr-4">
                        Установлено 123 Вариативных замка Golden Soft для отеля
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox defaultChecked className="mr-4">
                        Было нанесено личный брендинг на все замки
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox defaultChecked className="mr-4">
                        Были проведены монтажные работы, также была произведена
                        помощь в подключении замков к системе
                      </Checkbox>
                    </Col>
                  </Row>

                  <p className="text-lg font-semibold text-gray-800 mt-4 text-center md:text-left">
                    Бюджет - <span className="text-blue-500">$5000</span>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </Carousel>

      <div className="flex justify-center items-center mt-8 space-x-4">
        <Button
          shape="circle"
          icon={<BiChevronLeft style={{ fontSize: "24px", color: "#333" }} />}
          style={{
            border: "none",
            background: "transparent",
          }}
          onClick={() => carouselRef.current?.prev()}
        />
        <div className="flex items-center space-x-2">
          {[...Array(3)].map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => {
                carouselRef.current?.goTo(index);
                setCurrentSlide(index);
              }}
            />
          ))}
        </div>
        <Button
          shape="circle"
          icon={<BiChevronRight style={{ fontSize: "24px", color: "#333" }} />}
          style={{
            border: "none",
            background: "transparent",
          }}
          onClick={() => carouselRef.current?.next()}
        />
      </div>
      <div className="bg-[#F2F8FF] w-full py-[40px] my-[30px] flex flex-col items-center max-w-full mx-auto">
        <div className="max-w-screen-md text-center mx-auto px-4">
          <h1 className="font-bold">{t("Doyouhaveanyquestions")}</h1>
          <p className="max-w-[390px] mx-auto mt-2">
            {t("callbacksDescription")}
          </p>

          <InputContainer>
            <Input
              placeholder={t("yourName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full sm:w-[200px] mb-4"
            />
            <Input
              placeholder={t("yourEmail")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-[200px] mb-4"
            />
            <Button
              type="primary"
              className="w-full sm:w-auto mb-4"
              onClick={Submit}
            >
              {t("submit")}
            </Button>
          </InputContainer>
        </div>
      </div>
      <Footers />
    </Layout>
  );
};

export default Wholesale;
