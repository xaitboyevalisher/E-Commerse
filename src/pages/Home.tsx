import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18/i18";
import {
  Layout,
  Button,
  Card,
  Row,
  Tag,
  Col,
  Carousel,
  Input,
  Spin,
  message,
} from "antd";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaCheck, FaGift } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Header from "../components/Headers";
import Footers from "@src/components/Headers/Footer";
import { Service, Category, Product, ContactRequest } from "../types";

const { Content } = Layout;

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  const { t } = useTranslation();

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    Category[]
  >(["categories"], async () => {
    const response = await api.get("category?page=1&limit=4");

    return response.data;
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<
    Service[]
  >(["services"], async () => {
    const response = await api.get("service");
    return response.data;
  });

  const { data: popularProducts = [], isLoading: productsLoading } = useQuery<
    Product[]
  >(["products"], async () => {
    const response = await api.get("product");
    return response.data;
  });

  const carouselRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const AfterChange = (current: number) => {
    setCurrentSlide(current);
  };

  useEffect(() => {
    const Resize = () => setIsDesktop(window.innerWidth >= 774);
    window.addEventListener("resize", Resize);

    return () => {
      window.removeEventListener("resize", Resize);
    };
  }, []);

  if (categoriesLoading || productsLoading || servicesLoading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    const contactData: ContactRequest = { name, email };

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header isDesktop={isDesktop} />
      <Content className="mt-8 flex justify-center items-center bg-[#F7F7F7]">
        <div className="w-full max-w-screen-lg px-4">
          <Carousel
            autoplay
            ref={carouselRef}
            dots={false}
            afterChange={AfterChange}
          >
            {[1, 2, 3].map((slide) => (
              <div key={slide}>
                <Row
                  gutter={[16, 16]}
                  className="flex flex-col md:flex-row items-center"
                >
                  <Col
                    xs={24}
                    md={12}
                    className="flex justify-center md:justify-end"
                  >
                    <img
                      src={"/Rectangle 751.png"}
                      alt={`product-${slide}`}
                      style={{ maxWidth: "400px", backgroundColor: "white" }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    md={12}
                    className="flex flex-col justify-center pl-4 md:pl-8"
                  >
                    <h1 className="text-3xl font-bold max-w-[400px]">
                      {i18n.t("productTitle")}
                    </h1>
                    <h2 className="text-2xl font-semibold mt-1">
                      {i18n.t("productSubtitle")}
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-[265px] hidden md:block">
                      {i18n.t("productDescription1")}
                    </p>
                    <p className="text-gray-600 mt-4 max-w-[245px] hidden md:block">
                      {i18n.t("productDescription2")}
                    </p>
                    <div className="flex items-center mt-4">
                      <div className="text-3xl font-semibold text-blue-600">
                        {i18n.t("productPriceCurrent")}
                      </div>
                      <div className="text-gray-400 line-through ml-4">
                        {i18n.t("productPriceOld")}
                      </div>
                    </div>
                    <Button
                      type="primary"
                      className="mt-4"
                      style={{ width: "200px" }}
                    >
                      {i18n.t("addToCart")}
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </Carousel>
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button
              shape="circle"
              icon={
                <BiChevronLeft style={{ fontSize: "24px", color: "#333" }} />
              }
              style={{ border: "none", background: "transparent" }}
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
              icon={
                <BiChevronRight style={{ fontSize: "24px", color: "#333" }} />
              }
              style={{ border: "none", background: "transparent" }}
              onClick={() => carouselRef.current?.next()}
            />
          </div>
        </div>
      </Content>

      <Content className="bg-gray-100 p-8 bg-[#F2F8FF] mt-20">
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6} className="text-center">
            <h2 className="text-3xl font-bold">{t("happyClientsCount")}</h2>
            <p>{t("happyClientsText")}</p>
          </Col>
          <Col xs={24} sm={12} md={6} className="text-center">
            <h2 className="text-3xl font-bold">
              {t("productsAvailableCount")}
            </h2>
            <p>{t("productsAvailableText")}</p>
          </Col>
          <Col xs={24} sm={12} md={6} className="text-center">
            <h2 className="text-3xl font-bold">{t("salesPerDayCount")}</h2>
            <p>{t("salesPerDayText")}</p>
          </Col>
          <Col xs={24} sm={12} md={6} className="text-center">
            <h2 className="text-3xl font-bold">{t("yearsInMarketCount")}</h2>
            <p>{t("yearsInMarketText")}</p>
          </Col>
        </Row>
      </Content>

      <div className="container py-12 flex flex-col items-center max-w-screen-xl w-full mx-auto">
        <h2 className="text-center text-2xl font-bold mb-8">
          Почему GoldenService?
        </h2>
        <Row gutter={[16, 16]} justify="center" className="w-full">
          {services.map((service, index) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              key={index}
              className="flex justify-center"
            >
              <Card
                bordered={false}
                className="shadow-md hover:shadow-lg transition-shadow w-[300px] mx-auto"
              >
                <div className="flex justify-center py-4">
                  <img
                    src={service.image}
                    alt={`Service ${index + 1}`}
                    style={{ width: 82, height: 62 }}
                  />
                </div>
                <div className="text-center text-gray-600">{service.title}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="combined-container">
        <div className="categories py-12 flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold mb-8">
            {i18n.t("categories")}
          </h2>
          <Row
            gutter={[32, 32]}
            justify="center"
            className="w-full max-w-screen-lg"
          >
            {categories?.items?.map((category) => (
              <Col
                xs={24}
                sm={12}
                md={12}
                lg={12}
                key={category.id}
                className="flex justify-center"
              >
                <Card
                  hoverable
                  className="shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                  style={{ width: "600px", height: "470px", padding: "0" }}
                >
                  <img
                    src={category.image}
                    alt={i18n.t(`categoriesList.${category.title}`)}
                    className="absolute right-0 top-0"
                    style={{ width: "600px", height: "470px", padding: "0" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-lg font-semibold">
                      {i18n.t(`categoriesList.${category.title}`)}
                    </div>
                    <Button
                      type="default"
                      style={{ width: "200px", height: "50px" }}
                      className="mt-4"
                    >
                      {i18n.t("goTo")}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Button type="primary" className="mt-8 px-8 py-2">
            {i18n.t("allCategories")}
          </Button>
        </div>
      </div>

      <Content className="py-12 flex flex-col items-center w-full max-w-[1440px] mx-auto">
        <h2 className="text-center text-2xl font-bold mb-8">
          {t("popularProducts")}
        </h2>
        <Row gutter={[16, 16]} justify="center" className="w-full">
          {popularProducts.map((product) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={product.id}
              className="flex justify-center"
            >
              <Card
                hoverable
                className="shadow-md hover:shadow-lg transition-shadow relative overflow-hidden w-[240px] h-[380px]"
                cover={
                  <div className="relative">
                    {!product.available && (
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <Tag color="red" className="flex items-center gap-1">
                          <AiOutlineClose className="text-lg" />{" "}
                          {t("notAvailable")}
                        </Tag>
                        {product.hasGift && (
                          <Tag color="blue" className="flex items-center gap-1">
                            <FaGift className="text-lg" /> {t("gift")}
                          </Tag>
                        )}
                      </div>
                    )}
                    {product.onSale && (
                      <Tag color="green" className="absolute top-2 right-2">
                        SALE
                      </Tag>
                    )}
                    {product.available && (
                      <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
                        <Tag color="green" className="flex items-center gap-1">
                          <FaCheck className="text-lg" /> {t("available")}
                        </Tag>
                        {product.hasGift && (
                          <Tag color="blue" className="flex items-center gap-1">
                            <FaGift className="text-lg" /> {t("gift")}
                          </Tag>
                        )}
                      </div>
                    )}
                    <img
                      alt={product.title}
                      src={product.image}
                      className="w-full h-[240px] object-cover"
                    />
                  </div>
                }
              >
                <h3 className="font-bold text-lg">{product.title}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-blue-600 text-xl font-semibold">
                    {product.price}
                  </span>
                  <span className="text-gray-400 line-through ml-2">
                    {product.originalPrice}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="bg-[#F2F8FF] w-full py-[40px] my-[30px] flex flex-col items-center max-w-full mx-auto">
          <div className="max-w-screen-md text-center mx-auto px-4">
            <h1 className="font-bold">{t("callbacks")}</h1>
            <p>{t("callbackDescription")}</p>
            <div>
              <Input
                placeholder={t("yourName")}
                className="w-full sm:w-[200px] mx-auto mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder={t("yourEmail")}
                className="w-full sm:w-[200px] mx-auto mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="primary"
                className="w-full sm:w-auto"
                onClick={handleSubmit}
                loading={loading}
                disabled={!name || !email}
              >
                {t("submit")}
              </Button>
            </div>
          </div>
        </div>
      </Content>
      <Footers />
    </Layout>
  );
};

export default Home;
