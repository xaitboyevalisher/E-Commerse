import { useState, useEffect } from "react";
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
} from "antd";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaBars, FaPhoneAlt, FaUser } from "react-icons/fa";
import { AiOutlineShoppingCart, AiOutlineHeart } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import i18n from "../../i18/i18";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiTrash } from "react-icons/fi";

const { Text, Title } = Typography;

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  gift?: string;
};

const Header = ({ isDesktop }: { isDesktop: boolean }) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Дверной Замок Golden Soft для офиса",
      price: 33000,
      quantity: 2,
      image: "lock-image-url",
      gift: "Приложение к замкам Golden Service",
    },
  ]);

  const QuantityChange = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const Remove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const AddToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
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
    const token = localStorage.getItem("access_token");
    if (!token) {
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

  const { Header: AntHeader } = Layout;

  return (
    <div>
      <div className="bg-gray-700 text-white p-2 flex flex-col md:flex-row justify-between items-center">
        <div className="flex justify-center items-center gap-2 w-full">
          <span className="text-sm text-center">{t("promotion")}</span>
        </div>

        <Button
          type="link"
          className="text-white hidden md:block text-sm mt-2 md:mt-0"
        >
          {t("callback")}
        </Button>
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
                          <Menu.Item key="21">
                            <Link to="/product">{t("catalogItem1")}</Link>
                          </Menu.Item>
                          <Menu.Item key="22">
                            <Link to="/product">{t("catalogItem2")}</Link>
                          </Menu.Item>
                          <Menu.Item key="23" className="text-gray-700">
                            <Link to="/product">{t("catalogItem3")}</Link>
                          </Menu.Item>
                          <Menu.Item key="24" className="text-gray-700">
                            <Link to="/product">{t("catalogItem4")}</Link>
                          </Menu.Item>
                          <Menu.Item key="25" className="text-gray-700">
                            <Link to="/product">{t("catalogItem5")}</Link>
                          </Menu.Item>
                          <Menu.Item key="26" className="text-gray-700">
                            <Link to="/product">{t("catalogItem6")}</Link>
                          </Menu.Item>
                          <Menu.Item key="27" className="text-gray-700">
                            <Link to="/product">{t("catalogItem7")}</Link>
                          </Menu.Item>
                          <Menu.Item key="28" className="text-gray-700">
                            <Link to="/product">{t("catalogItem8")}</Link>
                          </Menu.Item>

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
                        <Menu.Item key="21" className="text-gray-700">
                          <Link to="/product">{t("catalogItem2")}</Link>
                        </Menu.Item>
                        <Menu.Item key="22" className="text-gray-700">
                          <Link to="/product">{t("catalogItem3")}</Link>
                        </Menu.Item>
                        <Menu.Item key="23" className="text-gray-700">
                          <Link to="/product">{t("catalogItem4")}</Link>
                        </Menu.Item>
                        <Menu.Item key="24" className="text-gray-700">
                          <Link to="/product">{t("catalogItem5")}</Link>
                        </Menu.Item>
                        <Menu.Item key="25" className="text-gray-700">
                          <Link to="/product">{t("catalogItem6")}</Link>
                        </Menu.Item>
                        <Menu.Item key="26" className="text-gray-700">
                          <Link to="/product">{t("catalogItem7")}</Link>
                        </Menu.Item>
                        <Menu.Item key="27" className="text-gray-700">
                          <Link to="/product">{t("catalogItem8")}</Link>
                        </Menu.Item>
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

                      <img
                        src="/Rectangle 728.png"
                        alt="Elektron zamok"
                        className="object-contain flex justify-center items-center rounded-md p-2"
                      />
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
              <h1 className="mb-0">+7 (966) 55 88 499</h1>
            </div>

            <div className="flex items-center gap-4">
              <AiOutlineHeart className="text-2xl text-gray-600" />
              <Badge count={cart.length} size="small" offset={[10, 0]}>
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
                {userName ? <span>{userName}</span> : <span>{t("profile")}</span>}
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
            <Button type="primary" className="mr-2">
              Оформить заказ
            </Button>
            <Button>Продолжить покупки</Button>
          </div>
        </div>

        <div className="mt-6">
          <Title level={5}>С этим покупают</Title>
          <List
            dataSource={[
              {
                id: 2,
                name: "Замок Golden Soft",
                price: 9000,
                image: "lock-image-url",
              },
            ]}
            renderItem={(item) => (
              <List.Item key={item.id} className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover mr-4"
                />
                <div className="flex-1">
                  <Text>{item.name}</Text>
                </div>
                <Button
                  type="link"
                  icon={<FiPlus />}
                  onClick={() => AddToCart(item)}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Header;
