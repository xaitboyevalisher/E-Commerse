import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Header from "../components/Headers";
import Footers from "../components/Headers/Footer";
import { Card, Col, Layout, Row, Spin, Button, Select } from "antd";
import { useTranslation } from "react-i18next";

interface Category {
  id: number;
  name: string;
  photoPath: string;
  createdAt: string;
  updatedAt: string;
}

const Categories = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  const [visibleCount, setVisibleCount] = useState(8);
  const [language, setLanguage] = useState("en");
  const { t, i18n } = useTranslation();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >(["categories", language], async () => {
    const response = await api.get("/category/get-all", {
      params: { page: 0, size: 10 },
      headers: { "Accept-Language": language },
    });
    return response.data.data;
  });

  console.log(i18n.language);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 774);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleShowMore = () => {
    setVisibleCount(categories.length);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <Layout>
      <Header isDesktop={isDesktop} />
      <div className="combined-container">
        <div className="categories py-12 flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold mb-8">Categories</h2>

          <Select
            defaultValue="en"
            style={{ width: 120, marginBottom: 20 }}
            onChange={handleLanguageChange}
          >
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="uz">Uzbek</Select.Option>
            <Select.Option value="ru">Russian</Select.Option>
          </Select>
          <Row
            gutter={[32, 32]}
            justify="center"
            className="w-full max-w-screen-lg"
          >
            {Array.isArray(categories) &&
              categories.slice(0, visibleCount).map((category) => (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  key={category.id}
                  className="flex justify-center"
                >
                  <Card
                    hoverable
                    className="shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                    bodyStyle={{
                      padding: "12px",
                    }}
                  >
                    <img
                      src={`http://${category.photoPath}`}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "80%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginTop: "8px",
                      }}
                    >
                      {category.name}
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
          {visibleCount < categories.length && (
            <Button
              type="primary"
              onClick={handleShowMore}
              className="mt-8"
              style={{
                padding: "10px 20px",
                fontSize: "16px",
              }}
            >
              Show All Categories
            </Button>
          )}
        </div>
      </div>
      <Footers />
    </Layout>
  );
};

export default Categories;
