import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import {
  Layout,
  Slider,
  Checkbox,
  Button,
  Tag,
  Select,
  Card,
  Pagination,
  Row,
  Col,
  Input,
} from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineStar } from "react-icons/ai";
import { FaCheckCircle, FaGift } from "react-icons/fa";
import Header from "../components/Headers";
import Footers from "@src/components/Headers/Footer";

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

const useProducts = (language: string) => {
  return useQuery<Product[]>({
    queryKey: ["products", language],
    queryFn: async () => {
      const response = await api.get(`/lock/get-all-by-filter`, {
        params: { page: 0, size: 10 },
        headers: { "Accept-Language": language },
      });
      return response.data.data;
    },
  });
  1;
};

const ProductPage: React.FC = () => {
  const { categoryTitle } = useParams<{ categoryTitle: string }>();
  const [isPriceVisible, setIsPriceVisible] = useState(true);
  const [isColorVisible, setIsColorVisible] = useState(false);
  const [isMaterialVisible, setIsMaterialVisible] = useState(false);
  const [isSizeVisible, setIsSizeVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  const { t } = useTranslation();

  const language = "en"; // Or get this from your language context/state
  const { data: products = [], isLoading: productsLoading } =
    useProducts(language);

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

  return (
    <Layout className="min-h-screen bg-gray-100">
      <Header isDesktop={isDesktop} />
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

          <Row gutter={16}>
            <Col xs={24} sm={8} md={6} lg={5}>
              <div className="p-4 bg-white shadow-md rounded-md">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Цена</h3>
                    <IoIosArrowDown
                      onClick={() => setIsPriceVisible(!isPriceVisible)}
                      className="cursor-pointer"
                    />
                  </div>

                  {isPriceVisible && (
                    <>
                      <div className="flex justify-between text-gray-500 text-sm">
                        <span>79 000 ₽</span>
                        <span>24 500 ₽</span>
                      </div>
                      <Slider
                        range
                        defaultValue={[24500, 79000]}
                        min={0}
                        max={100000}
                        className="mt-2"
                      />
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium mb-2">Особенности</h3>
                    <IoIosArrowDown
                      onClick={() => setIsOpen(!isOpen)}
                      className="cursor-pointer"
                    />
                  </div>

                  {isOpen && (
                    <>
                      <Checkbox>Электронные кодовые замки (68)</Checkbox>
                      <br />
                      <Checkbox>Биометрические замки (15)</Checkbox>
                      <br />
                      <Checkbox>Замок с отпечатком (28)</Checkbox>
                      <br />
                      <Checkbox>Замок с бесконтактной картой (13)</Checkbox>
                      <br />
                      <Checkbox>Программируемые замки (16)</Checkbox>
                      <br />
                      <Checkbox>Замки на батарейках (48)</Checkbox>
                      <br />
                      <Checkbox>Замки с удаленным доступом (20)</Checkbox>
                      <br />
                      <Checkbox>Bluetooth замки (18)</Checkbox>
                      <br />
                      <Checkbox>Электронные замки для квартиры (24)</Checkbox>
                      <br />
                      <Checkbox>Замки для стеклянных дверей (11)</Checkbox>
                      <br />
                      <Checkbox>Электронные цилиндры (9)</Checkbox>
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <h3
                    className="text-sm font-medium flex items-center justify-between cursor-pointer"
                    onClick={() => setIsColorVisible(!isColorVisible)}
                  >
                    Цвет <IoIosArrowDown />
                  </h3>
                  {isColorVisible && (
                    <div>
                      <Checkbox>Черный</Checkbox>
                      <br />
                      <Checkbox>Белый</Checkbox>
                      <br />
                      <Checkbox>Серебристый</Checkbox>
                      <br />
                      <Checkbox>Золотистый</Checkbox>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3
                    className="text-sm font-medium flex items-center justify-between cursor-pointer"
                    onClick={() => setIsMaterialVisible(!isMaterialVisible)}
                  >
                    Материал <IoIosArrowDown />
                  </h3>
                  {isMaterialVisible && (
                    <div>
                      <Checkbox>Металл</Checkbox>
                      <br />
                      <Checkbox>Пластик</Checkbox>
                      <br />
                      <Checkbox>Нержавеющая сталь</Checkbox>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h3
                    className="text-sm font-medium flex items-center justify-between cursor-pointer"
                    onClick={() => setIsSizeVisible(!isSizeVisible)}
                  >
                    Размеры <IoIosArrowDown />
                  </h3>
                  {isSizeVisible && (
                    <div>
                      <Checkbox>Маленький</Checkbox>
                      <br />
                      <Checkbox>Средний</Checkbox>
                      <br />
                      <Checkbox>Большой</Checkbox>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <Col xs={24} sm={16} md={18} lg={19}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="rounded-md shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                    cover={
                      <img
                        alt={product.name}
                        src={product.photos[0] || "/placeholder.jpg"}
                        className="h-48 w-full object-cover"
                      />
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
                      <Button type="primary" block className="mt-4">
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <Row justify="center" className="mt-8">
                <Pagination
                  current={currentPage}
                  onChange={PageChange}
                  total={products.length}
                  pageSize={12}
                  showSizeChanger={false}
                />
              </Row>
            </Col>
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
                      <h3 className="font-semibold text-lg">{product.name}</h3>
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
                      <Button type="primary" block className="mt-4">
                        Add to Cart
                      </Button>
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
          <h1 className="font-bold">{t("callbacks")}</h1>
          <p>{t("callbackDescription")}</p>
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

export default ProductPage;
