import { useParams } from "react-router-dom";
import { Button, Select, Tabs, Collapse, Rate, Spin, message } from "antd";
import { AiOutlineHeart } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import { useState, useEffect } from "react";
import { CartItem } from "../App";
import { FiRefreshCcw } from "react-icons/fi";

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
  lockId: number;
}

const Locks = async (): Promise<Lock[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await api.get("/lock/get-all-by-filter", {
    params: { page: 0, size: 10 },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

const fetchComments = async (lockId: number): Promise<Comment[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await api.get(`/comment/get-all-by-lock/${lockId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

const addComment = async (newComment: Comment) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) throw new Error("No access token found");

  try {
    const response = await api.post("/comment/add", newComment, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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
  const [visibleComments, setVisibleComments] = useState(5);
  const [lockId, setLockId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["locks"],
    queryFn: Locks,
  });

  const lock = data?.find((lock) => lock.id.toString() === id);

  useEffect(() => {
    if (lock) {
      setLockId(lock.id);
    }
  }, [lock]);

  const { data: comments } = useQuery({
    queryKey: ["comments", lockId],
    queryFn: () => (lockId ? fetchComments(lockId) : []),
    enabled: !!lockId,
  });

  const commentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", lockId]);
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

  const handleShowMore = () => {
    if (comments) {
      setVisibleComments((prev) => Math.min(prev + 5, comments.length));
    }
  };

  const handleSubmit = () => {
    if (!name || !email || !text) {
      message.error("Заполните все поля");
      return;
    }

    if (!lockId) {
      message.error("Не удалось определить продукт для отзыва.");
      return;
    }

    commentMutation.mutate({
      name,
      email,
      text,
      stars,
      createdAt: new Date().toISOString(),
      lockId: lockId,
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
                <p>300 г</p>
              </div>
            </div>
          </TabPane>

          <TabPane tab="Описание" key="3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p>{lock.description || "Описание отсутствует"}</p>
            </div>
          </TabPane>

          <TabPane tab="Отзывы" key="4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                {comments?.length ? (
                  <>
                    <div className="space-y-4">
                      {comments
                        .slice(0, visibleComments)
                        .map((comment, index) => (
                          <div key={index} className="border p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold">
                                {comment.name}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {comment.createdAt}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {comment.email}
                            </p>
                            <Rate disabled value={comment.stars} />
                            <p className="mt-2">{comment.text}</p>
                          </div>
                        ))}
                    </div>
                    {visibleComments < comments.length && (
                      <div className="flex justify-center mt-4">
                        <Button
                          type="link"
                          onClick={handleShowMore}
                          className="flex items-center gap-2"
                        >
                          <FiRefreshCcw size={18} />
                          <span>Показать еще</span>
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-4">Нет отзывов</div>
                )}
              </div>
              <div className="lg:w-1/3 border p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Добавить отзыв</h3>
                <div className="mb-4">
                  <span className="block font-medium mb-2">Ваша оценка:</span>
                  <Rate onChange={(value) => setStars(value)} value={stars} />
                </div>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 p-2 w-full border rounded-md"
                />
                <input
                  type="email"
                  placeholder="Ваш email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 p-2 w-full border rounded-md"
                />
                <textarea
                  placeholder="Ваш отзыв"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-2 p-2 w-full border rounded-md"
                />
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={commentMutation.isLoading}
                  className="mt-4 w-full"
                >
                  Оставить отзыв
                </Button>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
