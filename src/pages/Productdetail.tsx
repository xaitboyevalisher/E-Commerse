import { useParams } from "react-router-dom";
import { Button, Select, Tabs, Collapse, Rate, Spin, message } from "antd";
import { AiOutlineHeart } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import { useState } from "react";
import { CartItem } from "../App";

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

interface Comment {
  name: string;
  email: string;
  text: string;
  stars: number;
  createdAt: string;
}

const Locks = async (): Promise<Lock[]> => {
  const response = await api.get("/lock/get-all-by-filter", {
    params: { page: 0, size: 10 },
  });
  return response.data.data;
};

const fetchComments = async (lockId: number): Promise<Comment[]> => {
  const response = await api.get(`/comment/get-all-by-lock/${lockId}`);
  return response.data.data;
};

const addComment = async (newComment: Comment) => {
  try {
    const response = await api.post("/comment/add", newComment);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add comment");
  }
};

const ProductDetails = ({
  addToCart,
}: {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
}) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isAddingToBasket, setIsAddingToBasket] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);

  const { data, isLoading, error } = useQuery({
    queryKey: ["locks"],
    queryFn: Locks,
  });

  const lock = data?.find((lock) => lock.id.toString() === id);

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", lock?.id],
    queryFn: () => fetchComments(lock?.id || 0),
    enabled: !!lock?.id,
  });

  const commentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", lock?.id]);
      setName("");
      setEmail("");
      setText("");
      setStars(5);
      message.success("Отзыв добавлен");
    },
    onError: (error: Error) => {
      message.error("Ошибка при добавлении отзыва: " + error.message);
    },
  });

  const handleSubmit = () => {
    if (!name || !email || !text) {
      message.error("Заполните все поля");
      return;
    }

    commentMutation.mutate({
      name,
      email,
      text,
      stars,
      createdAt: new Date().toISOString(),
    });
  };

  const handleAddToBasket = () => {
    if (!lock) return;
    addToCart({
      id: lock.id,
      name: lock.name,
      price: lock.price,
      image: lock.photos[0],
    });
    message.success("Товар добавлен в корзину");
  };

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

  if (!lock) {
    return <div>Mahsulot tafsilotlari mavjud emas.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <h1 className="text-2xl font-semibold">{lock.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Rate disabled defaultValue={4} />
            <span className="text-gray-500">(22 отзывов)</span>
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

      <div className="mt-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Характеристики" key="2">
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-medium">Память на количество карт:</p>
                <p>2033</p>
              </div>
              <div>
                <p className="font-medium">Тип двери:</p>
                <p>Деревянная, металлическая</p>
              </div>
              <div>
                <p className="font-medium">Приложение:</p>
                <p>Нет</p>
              </div>
              <div>
                <p className="font-medium">Толщина двери:</p>
                <p>38-55 мм</p>
              </div>
              <div>
                <p className="font-medium">Материал:</p>
                <p>Сталь, силиконовые вставки</p>
              </div>
              <div>
                <p className="font-medium">Размеры:</p>
                <p>302мм × 43мм × 22.55мм</p>
              </div>
              <div>
                <p className="font-medium">Цвет:</p>
                <p>Черный, хром</p>
              </div>
              <div>
                <p className="font-medium">Вес:</p>
                <p>2.5 кг</p>
              </div>
              <div>
                <p className="font-medium">Питание:</p>
                <p>DC 6V, 4 AAA</p>
              </div>
              <div>
                <p className="font-medium">Комплектация:</p>
                <p>Без матрицы, с матрицей</p>
              </div>
              <div>
                <p className="font-medium">Разблокировка:</p>
                <p>
                  Пин-код, карта или браслет Mifare, ключ, приложение, отпечаток
                  пальца
                </p>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Описание" key="1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p>{lock.description || "Описание отсутствует"}</p>
            </div>
          </TabPane>
          <TabPane tab="Отзывы" key="3">
            {commentsLoading ? (
              <Spin />
            ) : commentsError ? (
              <div>Ошибка загрузки комментариев</div>
            ) : (
              <div className="flex flex-wrap">
                <div className="w-2/3 pr-4">
                  {comments?.map((comment, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-300 p-4 mb-4 rounded-lg bg-white shadow-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-gray-800">
                          {comment.name}
                        </strong>
                        <span className="text-gray-500 text-sm">
                          20 Августа, 2021
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.text}</p>
                      <Rate disabled defaultValue={comment.stars} />
                      <div className="mt-2 flex items-center text-gray-500 text-sm">
                        <span className="cursor-pointer">Ответить</span>
                        <span className="ml-4">1 комментарий</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-1/3 pl-4">
                  <h3 className="text-lg font-semibold mb-4">Оставить отзыв</h3>
                  <Rate
                    value={stars}
                    onChange={(value) => setStars(value)}
                    className="mb-4"
                  />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш Email"
                    className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ваш комментарий"
                    rows={4}
                    className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={commentMutation.isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Оставить отзыв
                  </Button>
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
