import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";
import Header from "../components/Headers";
import Footers from "@src/components/Headers/Footer";
import { Category } from "../types";
import { Card, Col, Layout, Row, Spin, Button } from "antd";
import { Link } from "react-router-dom";

const Categories = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 774);
  const [visibleCount, setVisibleCount] = useState(8);
  const { t } = useTranslation();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >(["categories"], async () => {
    const response = await api.get("category");
    return response.data;
  });

  useEffect(() => {
    const Resize = () => setIsDesktop(window.innerWidth >= 774);
    window.addEventListener("resize", Resize);

    return () => {
      window.removeEventListener("resize", Resize);
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
      <Header isDesktop={isDesktop} />
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
                      src={category.image}
                      alt={t(`categoriesList.${category.title}`)}
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
                      <Link
                        to={`/product/${category.title}`}
                        style={{ color: "inherit" }}
                      >
                        {t(`categoriesList.${category.title}`)}
                      </Link>
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
              {t("allCategories")}
            </Button>
          )}
        </div>
      </div>
      <Footers />
    </Layout>
  );
};

export default Categories;
