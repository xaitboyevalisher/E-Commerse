import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  InputNumber,
  Typography,
  List,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { CartItem, OrderRequest } from "../types";
import api from "../api/api";

const { Title, Text } = Typography;

const OrderPage = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>(
    location.state?.cartItems || []
  );

  useEffect(() => {
    const totalAmount = cartItems.reduce((acc: number, item: CartItem) => {
      return acc + item.price * item.quantity;
    }, 0);
    setTotal(totalAmount);
  }, [cartItems]);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      message.error("Вы не авторизованы. Пожалуйста, войдите в систему.");
      navigate("/login");
    }
  }, [navigate]);

  const handleInputNumberChange = (value: number | null, id: number) => {
    if (value !== null) {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: value };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    }
  };

  const onFinish = async (values: any) => {
    const orderData: OrderRequest = {
      orderLines: cartItems.map((item) => ({
        lockId: item.id,
        amount: item.quantity,
      })),
      customerDto: {
        name: values.firstName,
        surname: values.lastName,
        phone: values.phone,
        email: values.email,
      },
      orderDetailDto: {
        city: values.city || "",
        branch: values.branch || "",
        paymentType: values.payment === "card" ? "WITH_CARD" : "WITH_CASH",
        setupLock: values.installation || true,
        installSoft: values.installation || true,
        comment: values.comment || null,
      },
      promoCode: values.promoCode || null,
    };

    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      message.error("Вы не авторизованы. Пожалуйста, войдите в систему.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/order/add", orderData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        message.success("Заказ успешно оформлен!");

        navigate("/", {
          state: { orderId: response.data.orderId },
        });
      } else {
        message.error(
          "Ошибка при оформлении заказа. Пожалуйста, попробуйте снова."
        );
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      message.error(
        "Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже."
      );
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Title level={2} className="mb-4">
          Оформление заказа
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            delivery: "Cdek",
            payment: "cash",
            installation: true,
            quantity: 2,
          }}
        >
          <section className="mb-6">
            <Title level={4}>1. Контактные данные</Title>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="lastName"
                label="Фамилия"
                rules={[{ required: true, message: "Введите фамилию" }]}
              >
                <Input placeholder="Введите фамилию" />
              </Form.Item>
              <Form.Item
                name="firstName"
                label="Имя"
                rules={[{ required: true, message: "Введите имя" }]}
              >
                <Input placeholder="Введите имя" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Телефон"
                rules={[{ required: true, message: "Введите телефон" }]}
              >
                <Input placeholder="+7 (___) ___-__-__" />
              </Form.Item>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  { type: "email", message: "Введите корректный e-mail" },
                ]}
              >
                <Input placeholder="example@mail.ru" />
              </Form.Item>
            </div>
          </section>

          <section className="mb-6">
            <Title level={4}>2. Доставка</Title>
            <Form.Item name="delivery">
              <Radio.Group>
                <div className="flex flex-col space-y-2">
                  <Radio value="Cdek">CДЕК</Radio>
                  <Radio value="Post">Почта России</Radio>
                  <Radio value="Business">Деловые линии</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="city"
              label="Город"
              rules={[{ required: true, message: "Введите город" }]}
            >
              <Input placeholder="Введите город" />
            </Form.Item>
            <Form.Item
              name="branch"
              label="Филиал"
              rules={[{ required: true, message: "Введите филиал" }]}
            >
              <Input placeholder="Введите филиал" />
            </Form.Item>
          </section>

          <section className="mb-6">
            <Title level={4}>3. Оплата</Title>
            <Form.Item name="payment">
              <Radio.Group>
                <div className="flex flex-col space-y-2">
                  <Radio value="cash">Оплата при получении товара</Radio>
                  <Radio value="card">Банковская карта</Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </section>

          <Form.Item name="promoCode" label="Промокод">
            <Input placeholder="Введите промокод (если есть)" />
          </Form.Item>

          <Form.Item name="comment" label="Комментарий">
            <Input.TextArea placeholder="Напишите комментарий" rows={4} />
          </Form.Item>

          <Form.Item></Form.Item>
        </Form>
      </div>

      <div>
        <Title level={2} className="mb-4">
          Итого
        </Title>
        <div className="border p-4 rounded-md shadow-md">
          <List
            dataSource={cartItems}
            renderItem={(item: CartItem) => (
              <List.Item
                key={item.id}
                className="flex items-center justify-between py-3 px-4 border-b"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <Text strong className="text-lg">
                      {item.name}
                    </Text>
                    {item.gift && (
                      <Text type="secondary" className="block mt-1 text-sm">
                        + Подарок: {item.gift}
                      </Text>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Text className="text-lg">{item.price}₽</Text>

                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) =>
                      handleInputNumberChange(value, item.id)
                    }
                    className="w-20 text-center"
                  />
                </div>
              </List.Item>
            )}
          />

          <div className="flex justify-between items-center mt-4">
            <Text className="text-sm">Нужна установка</Text>
            <Form.Item name="installation" valuePropName="checked" noStyle>
              <Checkbox />
            </Form.Item>
          </div>

          <div className="text-xl font-semibold mt-4">К оплате: {total}₽</div>
        </div>
        <Button
          className="mt-5"
          type="primary"
          htmlType="submit"
          block
          onClick={() => form.submit()}
        >
          Подтвердить заказ
        </Button>
      </div>
    </div>
  );
};

export default OrderPage;
