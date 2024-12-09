import { Row, Col, Button, Input, Layout, message } from "antd";
import Header from "../components/Headers";
import Footers from "@src/components/Headers/Footer";
import { css } from "@emotion/react";
import api from "../api/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  useEffect(() => {
    const Resize = () => setIsDesktop(window.innerWidth >= 774);
    window.addEventListener("resize", Resize);
    return () => {
      window.removeEventListener("resize", Resize);
    };
  }, []);
  const { t } = useTranslation();

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

  return (
    <Layout>
      <Header isDesktop={isDesktop} />
      <div className="bg-gray-100 overflow-x-hidden w-full">
        <div className="container mx-auto py-10 px-4">
          <Row gutter={[32, 32]} justify="center" align="middle">
            <Col xs={24} sm={24} md={12} lg={12}>
              <video
                src="https://media.gettyimages.com/id/485407130/video/welding-work-at-industrial-factory.mp4?s=mp4-640x640-gi&k=20&c=QU-BEugOIgi4z2jEbn8eDNciMqpO7VVCqXZ31JvNpZQ="
                controls
                autoPlay
                loop
                muted
                className="w-full h-auto"
              ></video>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <h2
                className="text-3xl font-bold text-gray-800"
                css={css`
                  color: #1e293b;
                `}
              >
                Компания <span className="text-blue-500">Golden Soft</span>
              </h2>
              <p className="text-gray-600 mt-4 max-w-[415px]">
                Sit tempor ante justo amet duis. Ultricies cras eleifend elit,
                posuere et risus non. Id et ut pellentesque consequat, amet erat
                gravida euismod pharetra.
              </p>
            </Col>
          </Row>
        </div>

        <div className="bg-blue-800 text-white py-12">
          <div className="container mx-auto">
            <Row gutter={[32, 32]} justify="center" align="middle">
              <Col xs={24} sm={12} md={6} lg={6}>
                <h3 className="text-4xl font-bold">5,567</h3>
                <p>Счастливых клиентов</p>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <h3 className="text-4xl font-bold">1,245</h3>
                <p>Проектов на выбор</p>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <h3 className="text-4xl font-bold">372</h3>
                <p>Проекты в день</p>
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                <h3 className="text-4xl font-bold">20</h3>
                <p>Лет на рынке</p>
              </Col>
            </Row>
          </div>
        </div>

        <div className="container mx-auto py-10 px-4">
          <Row gutter={[32, 32]} justify="center" align="middle">
            <Col xs={24} sm={24} md={12}>
              <h3 className="text-xl font-bold text-blue-500 mb-4 max-w-[340px] mx-auto mt-2">
                НАША МИССИЯ
              </h3>
              <div className="relative">
                <p className="text-lg italic text-gray-700 max-w-[340px] mx-auto mt-2">
                  Sit Tempor Ante Justo Amet Duis. Ultricies Cras Eleifend Elit,
                  Posuere Et Risus Non. Id Et Ut Pellentesque Consequat, Amet
                  Erat Gravida Euismod Pharetra.
                </p>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} className="relative">
              <img
                className="rounded-lg shadow-lg"
                src="/Rectangle 815 (1).png"
                alt="Mission Image 1"
                style={{ width: "605px", height: "425px" }}
              />
              <img
                className="rounded-lg shadow-lg absolute bottom-0 left-0"
                src="/Rectangle 818.png"
                alt="Mission Image 2"
                style={{
                  width: "180px",
                  height: "202px",
                  transform: "translate(-30px, 30px)",
                }}
              />
            </Col>
          </Row>
        </div>

        <div className="bg-gray-50 py-12">
          <div className="container mx-auto">
            <Row gutter={[32, 32]} justify="center" align="top">
              <Col xs={24} md={12}>
                <div className="text-left">
                  <h1 className="font-bold text-2xl mb-4">
                    {t("Остались вопросы?")}
                  </h1>
                  <p className="mb-6 max-w-[380px] break-words">
                    Если у вас возникли какие-то вопросы по поводу оптовых
                    заказов, заполните форму и мы Вам перезвоним.
                  </p>

                  <div className="mb-4">
                    <Input
                      placeholder="Ваше имя"
                      className="mb-4"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: "499px" }}
                    />
                  </div>
                  <div className="mb-4">
                    <Input
                      placeholder="Ваш Email"
                      className="mb-4"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "499px" }}
                    />
                  </div>
                  <Button
                    type="primary"
                    className="mt-4"
                    onClick={Submit}
                    disabled={!name || !email}
                    style={{ width: "220px" }}
                  >
                    Отправить
                  </Button>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <h3 className="text-2xl font-bold mb-6 text-left">Контакты</h3>
                <Row gutter={[16, 16]} justify="center">
                  <Col xs={24} sm={12} md={8}>
                    <h4 className="text-lg font-semibold mb-2">Наш Адрес</h4>
                    <p className="text-gray-600">
                      Россия, Ростов-на-Дону <br /> ул. Богачева, 16
                    </p>
                    <img
                      src="/contact-image-1.jpg"
                      alt="Адрес"
                      className="rounded-lg shadow-lg mt-4"
                      style={{ width: "100%" }}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <h4 className="text-lg font-semibold mb-2">Телефоны</h4>
                    <p className="text-gray-600">
                      +7 (988) 565 00 38 <br /> +375 33 662 82 56
                    </p>
                    <img
                      src="/contact-image-2.jpg"
                      alt="Телефоны"
                      className="rounded-lg shadow-lg mt-4"
                      style={{ width: "100%" }}
                    />
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <h4 className="text-lg font-semibold mb-2">Email</h4>
                    <p className="text-gray-600">
                      vladperctev@mail.ru <br /> korobko416@gmail.com
                    </p>
                    <img
                      src="/contact-image-3.jpg"
                      alt="Email"
                      className="rounded-lg shadow-lg mt-4"
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <Footers />
    </Layout>
  );
};

export default AboutUs;
