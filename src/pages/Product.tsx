import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import {
  Layout,
  Button,
  Tag,
  Select,
  Card,
  Row,
  Col,
  Input,
  message,
} from "antd";

import { AiOutlineStar } from "react-icons/ai";
import { FaCheckCircle, FaGift } from "react-icons/fa";
import Footers from "@src/components/Headers/Footer";
import FilterComponent from "./Filter";

const { Option } = Select;
const { Content } = Layout;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  newPrice: number;
  categoryId: number;
  hasGift: boolean;
  photos: string[];
}

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  gift?: string;
};

const ProductPage: React.FC = () => {
  const { categoryTitle } = useParams<{ categoryTitle: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const useProducts = () => {
    const { i18n } = useTranslation();
    return useQuery<Product[]>({
      queryKey: ["products", i18n.language],
      queryFn: async () => {
        const response = await api.get(`/lock/get-all-by-filter`, {
          params: { startPrice: 0, page: 0, size: 10 },
          headers: { "Accept-Language": i18n.language },
        });
        return response.data.data;
      },
    });
  };

  const { data: products = [], isLoading: productsLoading } = useProducts();

  const PageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const Resize = () => setIsDesktop(window.innerWidth >= 774);
    window.addEventListener("resize", Resize);
    return () => {
      window.removeEventListener("resize", Resize);
    };
  }, []);

  const paginatedProducts = products.slice(
    (currentPage - 1) * 12,
    currentPage * 12
  );

  if (productsLoading) {
    return <div>Loading...</div>;
  }

  const Submit = async () => {
    const contactData = { name, email };

    try {
      await api.post("/api/v1/contact/add", contactData);

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

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.photos[0] || "/placeholder.jpg",
          },
        ];
      }
    });
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content>
        <div className="container mx-auto flex flex-col space-y-6">
          <div className="mt-8">
            <Row gutter={[16, 16]} align="middle" className="mb-6">
              <Col xs={24} sm={24} md={18} lg={18}>
                <h1 className="text-2xl font-semibold mb-2">
                  {categoryTitle
                    ? categoryTitle
                    : "Накладные электронные замки"}
                </h1>
              </Col>
            </Row>

            <Row gutter={[16, 16]} align="middle" className="mb-4">
              <Col
                xs={24}
                sm={16}
                md={16}
                lg={16}
                xl={16}
                className="flex items-center gap-4"
              >
                <Button className="text-black-500 underline">
                  Сбросить фильтры
                </Button>
                <Tag className="text-black-500 underline" closable>
                  Электронные кодовые замки
                </Tag>
              </Col>

              <Col
                xs={24}
                sm={8}
                md={8}
                lg={6}
                xl={6}
                className="flex justify-start md:justify-end"
              >
                <Select defaultValue="Популярности" className="w-full md:w-40">
                  <Option value="Популярности">Популярности</Option>
                  <Option value="Цене">Цене</Option>
                  <Option value="Новизне">Новизне</Option>
                </Select>
              </Col>
            </Row>
          </div>

          <Row gutter={8}>
            <FilterComponent />
          </Row>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 mx-auto px-4">
              Вы недавно просмотрели
            </h2>
            <Row gutter={[16, 16]}>
              {products.slice(0, 4).map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    className="rounded-md shadow-md hover:shadow-lg transition-shadow relative"
                    cover={
                      <img
                        alt={product.name}
                        src={product.photos[0] || "/placeholder.jpg"}
                        className="h-48 w-full object-cover"
                      />
                    }
                  >
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

                    {product.newPrice < product.price && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-white-500 text-black text-white px-2 py-1 text-xs font-bold rounded">
                          SALE
                        </span>
                      </div>
                    )}

                    <div className="p-3">
                      <h3 className="font-semibold text-lg">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, index) => (
                          <AiOutlineStar
                            key={index}
                            className="text-gray-300"
                          />
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
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <div className="mt-8">
            <div className="space-y-8">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <h3 className="text-lg font-semibold mb-2">
                    Eget quis quam metus, scelerisque.
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Odio felis sit leo, massa, mauris, at pulvinar ultricies. Eu
                    porttitor molestie massa porttitor. Quisque at turpis ut
                    proin eu et magna etiam rhoncus.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full sm:w-[70%] gap-2 text-sm text-gray-600 mb-4">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="mr-2" defaultChecked />{" "}
                      Межкомнатную дверь
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="mr-2" defaultChecked />{" "}
                      Межкомнатную дверь
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="mr-2" defaultChecked />{" "}
                      Деревянную дверь
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="mr-2" defaultChecked />{" "}
                      Деревянную дверь
                    </label>
                  </div>

                  <p className="text-gray-700">
                    Ac risus neque pulvinar tincidunt est. Tristique imperdiet
                    viverra interdum in leo. Nullam ullamcorper id enim
                    fermentum integer praesent bibendum. In ullamcorper purus
                    scelerisque malesuada et egestas. Ac dictumst mauris sed
                    facilisis.
                  </p>
                </Col>
                <Col xs={24} md={12}>
                  <img
                    alt={products[0]?.name}
                    src={products[0]?.photos[0] || "/placeholder.jpg"}
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <img
                    alt={products[1]?.name}
                    src={products[1]?.photos[0] || "/placeholder.jpg"}
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                </Col>

                <Col xs={24} md={12}>
                  <h3 className="text-lg font-semibold mb-2">
                    Eget quis quam metus, scelerisque.
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Odio felis sit leo, massa, mauris, at pulvinar ultricies. Eu
                    porttitor molestie massa porttitor. Quisque at turpis ut
                    proin eu et magna etiam rhoncus.
                  </p>
                  <p className="text-gray-700">
                    Ac risus neque pulvinar tincidunt est. Tristique imperdiet
                    viverra interdum in leo. Nullam ullamcorper id enim
                    fermentum integer praesent bibendum. In ullamcorper purus
                    scelerisque malesuada et egestas. Ac dictumst mauris sed
                    facilisis.
                  </p>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Content>
      <div className="bg-[#F2F8FF] w-full py-[40px] my-[30px] flex flex-col items-center max-w-full mx-auto">
        <div className="max-w-screen-md text-center mx-auto px-4">
          <h1 className="font-bold">{t("callback")}</h1>
          <p className="max-w-[390px] mx-auto mt-2">
            {t("callbackDescription")}
          </p>
          <InputContainer>
            <Input
              placeholder={t("yourName")}
              className="w-full sm:w-[200px] mb-4"
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder={t("yourEmail")}
              className="w-full sm:w-[200px] mb-4"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="primary" onClick={Submit}>
              {t("submit")}
            </Button>
          </InputContainer>
        </div>
      </div>

      <Footers />
    </Layout>
  );
};

export default ProductPage;
