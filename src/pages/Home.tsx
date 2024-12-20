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
import { Product, ContactRequest } from "../types";
import { Link, useNavigate } from "react-router-dom";

const { Content } = Layout;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

interface Category {
  id: number;
  name: string;
  photoPath: string;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >(
    ["categories", i18n.language],
    async () => {
      const response = await api.get("/category/get-all", {
        params: { page: 0, size: 10 },
        headers: { "Accept-Language": i18n.language },
      });
      return response.data.data;
    },
    { keepPreviousData: true }
  );

  const { data: popularProducts = [] } = useQuery<Product[]>(
    ["products", i18n.language],
    async () => {
      const response = await api.get(`/lock/get-all-by-filter`, {
        params: { page: 0, size: 10 },
        headers: { "Accept-Language": i18n.language },
      });
      return response.data.data;
    }
  );
  console.log(popularProducts, "popup");

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

  const handleGoToCategory = (id: any) => {
    navigate(`/product/${id}`);
  };

  const handleGoToAllCategories = () => {
    navigate("/Katalog/Category");
  };

  const displayedProducts = popularProducts.slice(0, 3);

  const carouselRef = useRef<any>(null);

  return (
    <Layout>
      <Content className="mt-8 flex justify-center items-center bg-[#F7F7F7]">
        <div className="w-full max-w-screen-lg px-4">
          <Carousel
            ref={carouselRef}
            autoplay
            dots={false}
            afterChange={(current) => setCurrentSlide(current)}
          >
            {displayedProducts.map((product) => (
              <div key={product.id}>
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
                      src={product.photos[0]} // Birinchi foto tasvir
                      alt={product.name}
                      style={{ maxWidth: "400px", backgroundColor: "white" }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    md={12}
                    className="flex flex-col justify-center pl-4 md:pl-8"
                  >
                    <h1 className="text-3xl font-bold max-w-[400px]">
                      {product.name}
                    </h1>
                    <p className="text-gray-600 mt-4 max-w-[265px] hidden md:block">
                      {product.description}
                    </p>
                    <div className="flex items-center mt-4">
                      <div className="text-3xl font-semibold text-blue-600">
                        {product.newPrice} ₽
                      </div>
                      {product.price !== product.newPrice && (
                        <div className="text-gray-400 line-through ml-4">
                          {product.price} ₽
                        </div>
                      )}
                    </div>
                    <Button
                      type="primary"
                      className="mt-4"
                      style={{ width: "200px" }}
                    >
                      Add to Cart
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
              onClick={() => carouselRef.current?.prev()} // Oldingi slayd
            />
            <div className="flex items-center space-x-2">
              {[...Array(displayedProducts.length)].map((_, index) => (
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
            {i18n.t("categories")}
          </h2>
          <Row
            gutter={[32, 32]}
            justify="center"
            className="w-full max-w-screen-lg"
          >
            {categories?.map((category: Category) => (
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
                  className="shadow-md hover:shadow-lg transition-shadow relative flex items-center"
                  style={{ width: "600px", height: "250px", padding: "0" }}
                >
                  <div className="flex flex-row items-center w-full h-full relative">
                    <div className="flex flex-col w-1/2 relative">
                      <div
                        className="text-lg font-semibold"
                        style={{
                          position: "absolute",
                          bottom: "45px",
                        }}
                      >
                        {category.name}
                      </div>
                      <Button
                        type="default"
                        style={{
                          width: "150px",
                          height: "45px",
                          marginTop: "85px",
                          bottom: "-25px",
                        }}
                        onClick={() => handleGoToCategory(category.id)}
                      >
                        {i18n.t("goTo")}
                      </Button>
                    </div>

                    <div className="w-1/2 h-full">
                      <img
                        src={category.photoPath}
                        alt={category.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            type="primary"
            className="mt-8 px-8 py-2"
            onClick={handleGoToAllCategories}
          >
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
                  <Link
                    to={`/product/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {product.name}
                  </Link>
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
