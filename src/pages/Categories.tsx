import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Footers from "../components/Headers/Footer";
import { Card, Col, Layout, Row, Spin, Button } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
  const { t, i18n } = useTranslation();

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

  return (
    <Layout>
      <div className="combined-container">
        <div className="categories py-12 flex flex-col items-center">
          <h2 className="text-center text-2xl font-bold mb-8">
            {t("categories")}
          </h2>

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
                      src={category.photoPath}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "80%",
                        objectFit: "cover",
                      }}
                    />

                    <Link
                      to="/product"
                      state={{
                        categoryId: category.id,
                        categoryName: category.name,
                      }}
                    >
                      {category.name}
                    </Link>
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
              {t("showAllCategories")}
            </Button>
          )}
        </div>
      </div>
      <Footers />
    </Layout>
  );
};

export default Categories;
