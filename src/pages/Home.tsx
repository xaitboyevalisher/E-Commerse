import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18/i18";
import { Layout, Button, Card, Row, Col, Carousel, Input, message } from "antd";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaCheckCircle, FaGift } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import styled from "@emotion/styled";
import api from "../api/api";
import Header from "../components/Headers";
import Footers from "@src/components/Headers/Footer";
import { Service, Category, Product, ContactRequest } from "../types";

const { Content } = Layout;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  const [visibleCount, setVisibleCount] = useState(8);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    ["categories", language],
    async () => {
      const response = await api.get("/category/get-all", {
        params: { page: 0, size: 10 },
        headers: { "Accept-Language": language },
      });
      return response.data.data;
    }
  );

  const { data: popularProducts = [] } = useQuery<Product[]>(
    ["products"],
    async () => {
      const response = await api.get(`/lock/get-all-by-filter`, {
        params: { page: 0, size: 10 },
        headers: { "Accept-Language": language },
      });
      return response.data.data;
    }
  );
  console.log(popularProducts, "popup");
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

  const handleShowMore = () => {
    setVisibleCount(categories.length);
  };

  const handleSubmit = async () => {
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
          <Col xs={24} sm={12} md={8} className="flex justify-center">
            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow w-[300px] mx-auto"
            >
              <div className="flex justify-center py-4">
                <img
                  src="/product-return 1 (3).png"
                  alt="Возврат удвоенной стоимости"
                  style={{ width: 82, height: 62 }}
                />
              </div>
              <div className="text-center text-gray-600">
                Возврат удвоенной стоимости каждого замка в случае брака.
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} className="flex justify-center">
            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow w-[300px] mx-auto"
            >
              <div className="flex justify-center py-4">
                <img
                  src="/evaluate 1 (1).png"
                  alt="Логотип компании"
                  style={{ width: 82, height: 62 }}
                />
              </div>
              <div className="text-center text-gray-600">
                Наносим ваш логотип компании на наш продукт.
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} className="flex justify-center">
            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow w-[300px] mx-auto"
            >
              <div className="flex justify-center py-4">
                <img
                  src="/product-return 1 (3).png"
                  alt="Возврат удвоенной стоимости"
                  style={{ width: 82, height: 62 }}
                />
              </div>
              <div className="text-center text-gray-600">
                Возврат удвоенной стоимости каждого замка в случае брака.
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="combined-container">
        <div className="categories py-12 flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold mb-8">
            {t("categories")}
          </h2>

          <Row
            gutter={[32, 32]}
            justify="center"
            className="w-full max-w-screen-lg"
          >
            {Array.isArray(categories) &&
              categories.slice(0, visibleCount).map((category) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={category.id}
                  className="flex justify-center"
                >
                  <Card
                    hoverable
                    className="shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                    bodyStyle={{
                      padding: "12px",
                    }}
                  >
                    <img
                      src={category.photoPath}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "80%",
                        objectFit: "cover",
                      }}
                    />

                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginTop: "8px",
                      }}
                    >
                      {category.name}
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
          {visibleCount < categories.length && (
            <Button
              type="primary"
              onClick={handleShowMore}
              className="mt-8"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
              }}
            >
              {t("showAllCategories")}
            </Button>
          )}
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
                key={product.id}
                className="rounded-md shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                cover={
                  product.photos?.[0] ? (
                    <img
                      alt={product.name}
                      src={product.photos[0]}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )
                }
              >
                {product.newPrice < product.price && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-white-500 text-black text-white px-2 py-1 text-xs font-bold rounded">
                      SALE
                    </span>
                  </div>
                )}

                <div className="absolute top-2 left-2 z-10">
                  <span className="flex items-center gap-1 text-green-500">
                    <FaCheckCircle /> В наличии
                  </span>

                  {product.hasGift && (
                    <span className="flex items-center gap-1 text-yellow-500 mt-2">
                      <FaGift /> Подарок
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, index) => (
                      <AiOutlineStar key={index} className="text-gray-300" />
                    ))}
                    <span className="text-gray-500 text-sm ml-2">
                      (0 отзывов)
                    </span>
                  </div>
                  <div className="flex items-center mt-2 gap-3">
                    <span className="text-lg font-bold text-black flex items-center gap-1">
                      ${product.price}
                    </span>
                    {product.newPrice < product.price && (
                      <span className="line-through text-gray-500 mr-2">
                        ${product.newPrice}
                      </span>
                    )}
                  </div>
                  <Button type="primary" block className="mt-4">
                    Add to Cart
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="bg-[#F2F8FF] w-full py-[40px] my-[30px] flex flex-col items-center max-w-full mx-auto">
          <div className="max-w-screen-md text-center mx-auto px-4">
            <h1 className="font-bold">{t("callback")}</h1>
            <p className="max-w-[390px] mx-auto mt-2">
              {t("callbackDescription")}
            </p>
            <div>
              <InputContainer>
                <Input
                  placeholder={t("yourName")}
                  className="w-full sm:w-[200px] mb-4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder={t("yourEmail")}
                  className="w-full sm:w-[200px] mb-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  type="primary"
                  className="w-full sm:w-auto"
                  onClick={handleSubmit}
                  disabled={!name || !email}
                >
                  {t("submit")}
                </Button>
              </InputContainer>
            </div>
          </div>
        </div>
      </Content>
      <Footers />
    </Layout>
  );
};

export default Home;
