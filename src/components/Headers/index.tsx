import React, { useState, useEffect } from "react";
import {
  Menu,
  Button,
  Dropdown,
  Badge,
  Layout,
  InputNumber,
  List,
  Modal,
  Typography,
  Spin,
} from "antd";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaBars, FaPhoneAlt, FaUser } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiTrash } from "react-icons/fi";
import { getLocks, Lock } from "../../productapi/locks";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/api";

const { Text, Title } = Typography;

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  gift?: string;
};

interface HeaderProps {
  isDesktop: boolean;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

interface Category {
  id: number;
  name: string;
  photoPath: string;
  createdAt: string;
  updatedAt: string;
}

const Header: React.FC<HeaderProps> = ({
  isDesktop,
  cartItems,
  setCartItems,
}) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // Access the current location
  const [userName, setUserName] = useState<string | null>(null);
  const [frequentlyBoughtLocks, setFrequentlyBoughtLocks] = useState<Lock[]>(
    []
  );
  const [isLoadingLocks, setIsLoadingLocks] = useState(false);

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

  const QuantityChange = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const Remove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const fetchLocks = async () => {
      setIsLoadingLocks(true);
      try {
        const locks = await getLocks();
        setFrequentlyBoughtLocks(locks.slice(0, 3));
      } catch (error) {
        console.error("Error fetching locks:", error);
      } finally {
        setIsLoadingLocks(false);
      }
    };

    fetchLocks();
  }, []);

  useEffect(() => {
    if (location.pathname === "/order") {
      setIsModalVisible(false);
    }
  }, [location]);

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => changeLanguage("uz")}>
        O'zbekcha
      </Menu.Item>
      <Menu.Item key="2" onClick={() => changeLanguage("ru")}>
        Русский
      </Menu.Item>
      <Menu.Item key="3" onClick={() => changeLanguage("en")}>
        English
      </Menu.Item>
    </Menu>
  );

  const UserClick = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
  };

  const showCartModal = () => {
    setIsModalVisible(true);
  };

  const CloseModal = () => {
    setIsModalVisible(false);
  };

  const addToCart = (lock: Lock) => {
    const newItem: CartItem = {
      id: lock.id,
      name: lock.name,
      price: lock.price,
      quantity: 1,
      image: lock.photos[0] || "/placeholder.jpg",
    };
    setCartItems((prev) => [...prev, newItem]);
  };

  const handleOrder = () => {
    navigate("/order", { state: { cartItems, totalPrice } });
  };

  const { Header: AntHeader } = Layout;

  if (categoriesLoading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "100vh" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-700 text-white p-2 flex flex-col md:flex-row justify-between items-center">
        <div className="flex justify-center items-center gap-2 w-full">
          <span className="text-sm text-center">{t("promotion")}</span>
        </div>
      </div>

      <AntHeader className="bg-white p-4 flex flex-col md:flex-row justify-between items-center shadow-sm w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-4">
            {!isDesktop && (
              <div className="relative">
                <FaBars
                  onClick={() => setMenuOpen(!isMenuOpen)}
                  className="cursor-pointer"
                />
                {isMenuOpen && (
                  <Menu
                    mode="vertical"
                    className="absolute left-0 bg-white border border-gray-300 z-10 p-4 rounded-lg shadow-md"
                  >
                    <Menu.Item key="1">
                      <Link to="/">{t("home")}</Link>
                    </Menu.Item>
                    <Menu.SubMenu
                      key="2"
                      title={
                        <span className="flex items-center">
                          {t("catalog")}{" "}
                          {isCatalogOpen ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      }
                      onTitleClick={toggleCatalog}
                    >
                      {isCatalogOpen && (
                        <div className="flex flex-col space-y-2">
                          {categories.map((category) => (
                            <Menu.Item key={category.id}>
                              <Link to={`/product/${category.id}`}>
                                {category.name}
                              </Link>
                            </Menu.Item>
                          ))}

                          <Menu.Item key="29">
                            <Button
                              type="primary"
                              className="w-full"
                              onClick={() => navigate("/Katalog/Category")}
                            >
                              {t("viewAll")}
                            </Button>
                          </Menu.Item>
                        </div>
                      )}
                    </Menu.SubMenu>

                    <Menu.Item key="3">
                      <Link to="/wholesale">{t("wholesale")}</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                      <Link to="/aboutus">{t("aboutUs")}</Link>
                    </Menu.Item>
                  </Menu>
                )}
              </div>
            )}

            <div className="font-bold text-xl text-blue-600 hidden md:block">
              <img src="/Logo (1).png" alt="Logotip" />
            </div>

            {isDesktop && (
              <Menu
                mode="horizontal"
                className="bg-transparent border-none flex space-x-6"
              >
                <Menu.Item key="1">
                  <Link to="/">{t("home")}</Link>
                </Menu.Item>
                <Menu.SubMenu
                  key="2"
                  title={
                    <span className="flex items-center">
                      {t("catalog")}{" "}
                      {isCatalogOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  }
                  onTitleClick={toggleCatalog}
                >
                  {isCatalogOpen && (
                    <div className="flex flex-row space-x-8 border border-gray-300 p-6 rounded-md shadow-md w-full max-w-3xl">
                      <div className="flex flex-col space-y-4 w-1/2">
                        <h2 className="font-semibold text-gray-800 border-b border-blue-500 pb-2">
                          {t("catalogItem1")}
                        </h2>

                        {categories.map((category) => (
                          <Menu.Item
                            key={category.id}
                            className="text-gray-700"
                          >
                            <Link
                              to="/product"
                              state={{
                                categoryId: category.id,
                                categoryName: category.name,
                              }}
                            >
                              {category.name}
                            </Link>
                          </Menu.Item>
                        ))}

                        <Menu.Item
                          key="29"
                          onClick={() => navigate("/Katalog/Category")}
                          style={{
                            backgroundColor: "blue",
                            color: "white",
                          }}
                        >
                          {t("viewAll")}
                        </Menu.Item>
                      </div>

                      {categories.length > 0 && categories[0].photoPath && (
                        <img
                          src={categories[0].photoPath}
                          alt={categories[0].name}
                          className="object-contain flex justify-center items-center rounded-md p-2"
                          style={{ width: "351px", height: "300px" }}
                        />
                      )}
                    </div>
                  )}
                </Menu.SubMenu>

                <Menu.Item key="3">
                  <Link to="/wholesale">{t("wholesale")}</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/aboutus">{t("aboutUs")}</Link>
                </Menu.Item>
              </Menu>
            )}
          </div>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-1 text-lg text-gray-600 hidden md:flex">
              <a href="tel:+79665588499">
                <FaPhoneAlt style={{ color: "blue" }} />
              </a>
              <p className="text-gray-400">
                <a href="tel:+375336628256">+998 88-826-25-55</a>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Badge count={cartItems.length} size="small" offset={[10, 0]}>
                <AiOutlineShoppingCart
                  className="text-2xl text-gray-600 cursor-pointer"
                  onClick={showCartModal}
                />
              </Badge>
              <div
                className="flex items-center cursor-pointer"
                onClick={UserClick}
              >
                <FaUser className="text-2xl mr-1" />
                {userName ? (
                  <span>{userName}</span>
                ) : (
                  <span>{t("profile")}</span>
                )}
              </div>
            </div>

            <Dropdown overlay={menu} trigger={["click"]}>
              <Button className="flex items-center">
                {i18n.language === "uz"
                  ? "O'zbekcha"
                  : i18n.language === "ru"
                  ? "Русский"
                  : "English"}{" "}
                <IoIosArrowDown className="ml-1" />
              </Button>
            </Dropdown>
          </div>
        </div>
      </AntHeader>

      <Modal
        title="Корзина"
        open={isModalVisible}
        onCancel={CloseModal}
        footer={null}
        width={600}
      >
        <List
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="flex flex-col border-b pb-4 mb-4"
            >
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover mr-4"
                  />
                  <div>
                    <Title level={5}>{item.name}</Title>
                    {item.gift && (
                      <Text type="secondary">
                        + Подарок:{" "}
                        <a href="#" className="text-blue-500 underline">
                          {item.gift}
                        </a>
                      </Text>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => QuantityChange(item.id, value || 1)}
                    className="mr-4"
                  />
                  <Text strong>{item.price * item.quantity}₽</Text>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<FiTrash />}
                  onClick={() => Remove(item.id)}
                />
              </div>
            </List.Item>
          )}
        />

        <div className="mt-4 flex justify-between items-center">
          <Title level={4}>
            Итого: <span>{totalPrice}₽</span>
          </Title>
          <div>
            <Button type="primary" className="mr-2" onClick={handleOrder}>
              Оформить заказ
            </Button>
            <Button>Продолжить покупки</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
