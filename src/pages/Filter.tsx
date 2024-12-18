import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Slider, Button, Col, Card, Row, Spin, message } from "antd";
import { FaCheckCircle, FaGift } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

// Types & Interfaces
interface LockType {
  id: number;
  name: string;
  price: number;
  newPrice: number;
  photos: string[];
  description: string;
  hasGift?: boolean;
}

const FilterPage: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState<LockType[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Filter state
  const [isPriceVisible, setIsPriceVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    100000, 250000,
  ]);
  const [lockSize, setLockSize] = useState({ a: 0, b: 0, c: 0 });

  // **Price range slider**
  const onPriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  // **Lock size handler**
  const onLockSizeChange = (sizeType: "a" | "b" | "c", value: number) => {
    setLockSize((prev) => ({ ...prev, [sizeType]: value }));
  };

  // Fetch products based on filters
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(
        `http://8.210.211.217:8080/api/v1/lock/get-all-by-filter?&startPrice=${priceRange[0]}&endPrice=${priceRange[1]}&a=${lockSize.a}&b=${lockSize.b}&c=${lockSize.c}`
      );
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setFilteredProducts(result.data);
      } else {
        console.error("Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Ошибка при загрузке продуктов.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div
      className="p-4"
      style={{ display: "flex", justifyContent: "space-around", gap: "50px", width:"100%" }}
    >
      <div className="filters-p" style={{ width: "200px" }}>
        {/* Filter Section */}
        <div className="p-4 bg-white shadow-md rounded-md mb-6">
          {/* Price Filter */}

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
                  <span>{priceRange[0]} ₽</span>
                  <span>{priceRange[1]} ₽</span>
                </div>
                <Slider
                  range
                  value={priceRange}
                  min={100000}
                  max={450000}
                  step={1000}
                  onChange={onPriceChange}
                  className="mt-2"
                />
              </>
            )}
          </div>
        </div>

        {/* Lock Sizes */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Размеры</h3>
          <div className="flex">
            {["a", "b", "c"].map((sizeType) => (
              <input
                key={sizeType}
                type="number"
                value={lockSize[sizeType as "a" | "b" | "c"]}
                onChange={(e) =>
                  onLockSizeChange(
                    sizeType as "a" | "b" | "c",
                    Number(e.target.value)
                  )
                }
                placeholder={sizeType}
                className="w-12 border p-1 mr-2"
              />
            ))}
          </div>
        </div>

        {/* Submit Filters */}
        <Button type="primary" onClick={fetchProducts} className="mt-4 w-full">
          Применить фильтры
        </Button>
      </div>

      {/* Filtered Products */}
      <div className="" style={{width:"100%"}}>
        <Row gutter={[16, 16]} className="mt-6" style={{ gap: "20px" }}>
          {loadingProducts ? (
             <Col xs={24} sm={12} md={8} lg={6} className="flex justify-center">
              <Spin size="large" />
            </Col>
          ) : (
            filteredProducts.map((product) => (
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
                      <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                        SALE
                      </span>
                    </div>
                  )}

                  <div className="p-3">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, index) => (
                        <AiOutlineStar key={index} className="text-gray-300" />
                      ))}
                      <span className="text-gray-500 text-sm ml-2">
                        (0 отзывов)
                      </span>
                    </div>
                    <div className="flex items-center mt-2 gap-3">
                      <span className="text-lg font-bold text-black">
                        {product.newPrice} ₽
                      </span>
                      {product.newPrice < product.price && (
                        <span className="line-through text-gray-500">
                          {product.price} ₽
                        </span>
                      )}
                    </div>
                    <Button type="primary" block className="mt-4">
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>

      </div>
    </div>
  );
};

export default FilterPage;
