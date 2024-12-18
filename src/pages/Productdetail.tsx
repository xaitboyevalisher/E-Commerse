import { useParams } from "react-router-dom";
import { Button, Select, Tabs, Collapse, Rate, Spin, message } from "antd";
import { AiOutlineHeart } from "react-icons/ai";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const addToBasket = async (lockId: number) => {
  try {
    const response = await api.post("/api/v1/basket/add", { lockId });
    return response.data;
  } catch (error) {
    throw new Error("Failed to add item to basket");
  }
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

const ProductDetails = () => {
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

  const handleAddToBasket = async () => {
    if (!lock) return;
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

          <p className="mt-4 text-gray-600">Подходит для установки на:</p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Деревянную дверь</li>
            <li>Межкомнатную дверь</li>
          </ul>

          <div className="mt-6 flex gap-8 items-start">
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

      <div className="mt-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Характеристики" key="1">
            <p>{lock.description || "Описание отсутствует"}</p>
          </TabPane>
          <TabPane tab="Описание" key="2">
            <p>{lock.description || "Описание отсутствует"}</p>
          </TabPane>
          <TabPane tab="Отзывы" key="3">
            {commentsLoading ? (
              <Spin />
            ) : commentsError ? (
              <div>Ошибка загрузки комментариев</div>
            ) : (
              <>
                {comments?.map((comment, idx) => (
                  <div key={idx} className="border p-4 mb-2">
                    <p>
                      <strong>{comment.name}</strong> — {comment.text}
                    </p>
                    <Rate disabled defaultValue={comment.stars} />
                  </div>
                ))}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Оставить отзыв</h3>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className="border p-2 w-full mb-4"
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email"
                    className="border p-2 w-full mb-4"
                  />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ваш комментарий"
                    className="border p-2 w-full mb-4"
                  />
                  <Rate
                    value={stars}
                    onChange={(value) => setStars(value)}
                    className="mb-4"
                  />
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={commentMutation.isLoading}
                  >
                    Отправить
                  </Button>
                </div>
              </>
            )}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
