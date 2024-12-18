import { Link, useParams } from "react-router-dom";
import { Button, Select, Tabs, Collapse, Rate, Spin, message } from "antd";
import { AiOutlineHeart } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import { useState } from "react";

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

interface Lock {
  id: number;
  name: string;
  description: string;
  price: number;
  color: string;
  lockType: string;
  createdAt: string;
  updatedAt: string;
  photos: string[];
}

// Backendga mahsulotlarni olish uchun so'rov
const Locks = async (): Promise<Lock[]> => {
  const response = await api.get("/lock/get-all-by-filter", {
    params: { page: 0, size: 10 },
  });
  return response.data.data;
};

const addToBasket = async (lockId: number) => {
  try {
    const response = await api.post("/api/v1/basket/add", { lockId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to add item to basket");
  }
};

// Mahsulot tafsilotlarini ko'rsatuvchi komponent
const ProductDetails = () => {
  const { id } = useParams();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["locks"],
    queryFn: Locks,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div>Xatolik yuz berdi: {(error as Error).message}</div>;
  }

  const lock = data?.find((lock) => lock.id.toString() === id);
  if (!lock) {
    return <div>Mahsulot tafsilotlari mavjud emas.</div>;
  }

  const handleAddToBasket = async () => {
    setIsAddingToBasket(true);
    try {
      await addToBasket(lock.id);
      message.success("Товар добавлен в корзину");
    } catch (error) {
      message.error("Не удалось добавить товар в корзину");
    } finally {
      setIsAddingToBasket(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Mahsulot rasmi va tafsilotlari */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rasm va thumbnaillar */}
        <div className="flex flex-col">
          <img
            src={selectedPhoto || lock.photos[0]}
            alt={lock.name}
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="flex justify-start mt-4 gap-2">
            {lock.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedPhoto(photo)}
                className={`w-16 h-16 object-cover rounded-md cursor-pointer ${
                  selectedPhoto === photo ? "border-2 border-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tafsilotlar */}
        <div>
          <h1 className="text-2xl font-semibold">{lock.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Rate disabled defaultValue={4} />
            <span className="text-gray-500">(22 отзывов)</span>
          </div>

          <p className="mt-4 text-gray-600">Подходит для установки на:</p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Деревянную дверь</li>
            <li>Межкомнатную дверь</li>
          </ul>

          {/* Комплектация va Цвет qismlari yonma-yon */}
          <div className="mt-6 flex gap-8 items-start">
            {/* Komplektatsiya */}
            <div>
              <p className="text-gray-600 mb-2 font-medium">Комплектация</p>
              <Select
                className="w-72"
                defaultValue="Smart замок без приложения"
                size="large"
              >
                <Option value="smart-lock">Smart замок без приложения</Option>
                <Option value="smart-lock-app">
                  Smart замок с приложением
                </Option>
              </Select>
            </div>

            {/* Цвет */}
            <div>
              <p className="text-gray-600 mb-2 font-medium">Цвет</p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-black rounded cursor-pointer border-2 border-gray-300"></div>
                <div className="w-8 h-8 bg-gray-400 rounded cursor-pointer border-2 border-gray-300"></div>
                <div className="w-8 h-8 bg-yellow-500 rounded cursor-pointer border-2 border-gray-300"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold">{lock.price}₽</p>
                <p className="text-sm line-through text-gray-500">37 000₽</p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  onClick={handleAddToBasket}
                  loading={isAddingToBasket}
                >
                  Купить
                </Button>
                <Button type="text">
                  <AiOutlineHeart size={20} />
                </Button>
              </div>
            </div>
            <div className="w-full">
              <Collapse>
                <Panel header="Оплата" key="1">
                  <p>
                    Оплата при получении товара, картой онлайн, Google Pay и
                    другими способами.
                  </p>
                </Panel>
                <Panel header="Монтаж и доставка" key="2">
                  <p>Информация о монтаже и доставке.</p>
                </Panel>
                <Panel header="Гарантии и выгода" key="3">
                  <p>Информация о гарантии и выгоде.</p>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs va Collapse */}
      <div className="mt-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Характеристики" key="1">
            <p>{lock.description || "Описание отсутствует"}</p>
          </TabPane>
          <TabPane tab="Описание" key="2">
            <p>{lock.description || "Описание отсутствует"}</p>
          </TabPane>
          <TabPane tab="Отзывы" key="3">
            <p>Отзывы покупателей...</p>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
