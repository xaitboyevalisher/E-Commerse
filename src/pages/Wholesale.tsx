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
} from "antd";
import Header from "../components/Headers";
import Footers from "@src/components/Headers/Footer";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useTranslation } from "react-i18next";

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
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;
const Wholesale = () => {
  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
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
          <h2>Оформите заявку и мы вам перезвоним</h2>
          <p>
            Vitae, urna, massa dictumst morbi ut id dui nulla. Purus a velit sem
            viverra. Nunc ac quis donec nunc eu blandit ante nibh. Sit felis
            nulla donec mauris quis nulla velit.
          </p>
        </div>
        <div css={formStyle}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <h3 className="text-lg font-semibold mb-4">Оформление заявки</h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Имя"
                  name="name"
                  rules={[{ required: true, message: "Введите ваше имя" }]}
                >
                  <Input placeholder="Ваше имя" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Название компании"
                  name="company"
                  rules={[
                    { required: true, message: "Введите название компании" },
                  ]}
                >
                  <Input placeholder="Имя вашей компании" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Номер телефона"
                  name="phone"
                  rules={[
                    { required: true, message: "Введите номер телефона" },
                  ]}
                >
                  <Input placeholder="+7 ( _ _ _ ) _ _ _ - _ _ - _ _" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Название товара"
                  name="product"
                  rules={[
                    { required: true, message: "Введите название товара" },
                  ]}
                >
                  <Input placeholder="Введите название или артикул товара" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item
                  label="Количество"
                  name="quantity"
                  rules={[
                    { required: true, message: "Введите количество товара" },
                  ]}
                >
                  <Input placeholder="Количество товара" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="services">
              <Checkbox.Group>
                <Row>
                  <Col span={24}>
                    <Checkbox value="logo">
                      Нанесение персонального логотипа (бесплатно)
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="help">
                      Помощь в монтажных работах (бесплатно)
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Отправить заявку
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div css={workSectionStyle}>
        <Title level={2}>Как мы работаем</Title>
        <div css={cardsContainer}>
          <Card>
            <img src="/path/to/image1.png" alt="Step 1" />
            <Title level={3}>Оформление заявки</Title>
            <Paragraph className="min-w-[370px]">
              Вы оставляете заявку на сайте или связываетесь с нами по
              указанному на сайте номеру телефона
            </Paragraph>
          </Card>
          <Card>
            <img src="/path/to/image2.png" alt="Step 2" />
            <Title level={3}>Согласование</Title>
            <Paragraph className="min-w-[350px]">
              Мы консультируем Вас, согласовываем стоимость и точное время
              приезда нашего специалиста
            </Paragraph>
          </Card>
          <Card>
            <img src="/path/to/image3.png" alt="Step 3" />
            <Title level={3}>Отправка товара и установка</Title>
            <Paragraph className="min-w-[350px]">
              Наш специалист по монтажу замков выезжает к Вам в точно зазначеное
              время по согласованному адресу
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
              className="w-full sm:w-[200px] mx-auto mb-4"
            />
            <Input
              placeholder={t("yourEmail")}
              className="w-full sm:w-[200px] mx-auto mb-4"
            />
            <Button type="primary" className="w-full sm:w-auto">
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
