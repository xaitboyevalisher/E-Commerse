import { Link, useParams } from "react-router-dom";
import { Button, Select, Tabs, Collapse, Rate, Spin } from "antd";
import { AiOutlineHeart } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import React from "react";

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
    params: {
      page: 0,
      size: 10,
    },
  });
  return response.data.data;
};

// Mahsulot tafsilotlarini ko'rsatuvchi komponent
const ProductDetails = () => {
  const { id } = useParams(); // URL'dan id olish

  // Mahsulotlar haqidagi ma'lumotlarni olish
  const { data, isLoading, error } = useQuery({
    queryKey: ["locks"],
    queryFn: Locks,
  });

  // Mahsulotlar yuklanayotgan bo'lsa
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Xatolik yuzaga kelsa
  if (error) {
    return <div>Xatolik yuz berdi: {(error as Error).message}</div>;
  }

  // Backenddan olingan mahsulotlar ro'yxati
  const lock = data?.find((lock) => lock.id.toString() === id); // `id` bo'yicha tegishli mahsulotni olish

  // Agar mahsulot topilmasa
  if (!lock) {
    return <div>Mahsulot tafsilotlari mavjud emas.</div>;
  }

  // Asosiy rasmani tanlash uchun useState hook
  const [selectedImage, setSelectedImage] = React.useState(lock?.photos?.[0]);

  const handleImageClick = (photo: string) => {
    setSelectedImage(photo);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <div className="flex flex-col">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={lock?.name}
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}

            <div className="flex justify-between mt-4">
              {lock?.photos?.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md shadow-md cursor-pointer"
                  onClick={() => handleImageClick(photo)}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">
            <Link
              to={`/product/${lock.id}`}
              className="text-blue-600 hover:underline"
            >
              {lock?.name}
            </Link>
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <Rate disabled defaultValue={4} />
            <span className="text-gray-500">(22 отзывов)</span>
          </div>

          <p className="mt-4 text-gray-600">Подходит для установки на:</p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Деревянную дверь</li>
            <li>Межкомнатную дверь</li>
          </ul>

          <div className="mt-6">
            <p className="text-gray-600 mb-2">Комплектация</p>
            <Select
              className="w-full"
              defaultValue="Smart замок без приложения"
            >
              <Option value="smart-lock">Smart замок без приложения</Option>
              <Option value="smart-lock-app">Smart замок с приложением</Option>
            </Select>
          </div>

          <div className="mt-4">
            <p className="text-gray-600 mb-2">Цвет</p>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-black rounded-full cursor-pointer border-2 border-gray-300"></div>
              <div className="w-6 h-6 bg-gray-300 rounded-full cursor-pointer border-2 border-gray-300"></div>
              <div className="w-6 h-6 bg-yellow-500 rounded-full cursor-pointer border-2 border-gray-300"></div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold text-black">{lock?.price}₽</p>
              <p className="text-sm line-through text-gray-500">37 000₽</p>
            </div>
            <div className="flex items-center gap-2">
              <Button type="primary" className="bg-blue-500 px-6">
                Купить
              </Button>
              <Button type="text">
                <AiOutlineHeart size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Характеристики" key="1">
            <p>{lock?.description || "Описание отсутствует"}</p>
          </TabPane>
          <TabPane tab="Описание" key="2">
            <p>{lock?.description || "Описание отсутствует"}</p>
          </TabPane>
          <TabPane tab="Отзывы" key="3">
            <p>Отзывы покупателей...</p>
          </TabPane>
        </Tabs>
      </div>

      <div className="mt-6">
        <Collapse>
          <Panel header="Оплата" key="1">
            <p>
              Оплата при получении товара, картой онлайн, Google Pay, и другими
              способами.
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
  );
};

export default ProductDetails;
