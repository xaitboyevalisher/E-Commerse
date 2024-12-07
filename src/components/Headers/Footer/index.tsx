import { Layout, Row, Col, Space } from "antd";
import { FaVk, FaTwitter, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Footer } = Layout;

const Footers = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Footer className="bg-[#0c2337] text-white py-10">
        <div className="container mx-auto px-4">
          <Row gutter={32}>
            <Col span={24} md={6}>
              <h1 className="text-4xl font-bold text-white">
                <img src="/Logo (2).png" alt="Logo" />
              </h1>
              <div className="mt-32"></div>
              <Space size="large" className="text-xl text-white">
                <FaVk className="hover:text-blue-500 cursor-pointer" />
                <FaTwitter className="hover:text-blue-500 cursor-pointer" />
                <FaFacebook className="hover:text-blue-500 cursor-pointer" />
              </Space>
            </Col>

            <Col span={24} md={6}>
              <h3 className="text-white text-lg mb-3">
                {t("footerNavigation")}
              </h3>
              <ul className="space-y-1 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-blue-500">
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link to="/Katalog/Category" className="hover:text-blue-500">
                    {t("catalog")}
                  </Link>
                </li>
                <li>
                  <Link to="/wholesale" className="hover:text-blue-500">
                    {t("wholesale")}
                  </Link>
                </li>
                <li>
                  <Link to="/aboutus" className="hover:text-blue-500">
                    {t("aboutUs")}
                  </Link>
                </li>
              </ul>
            </Col>

            <Col span={24} md={6}>
              <h3 className="text-white text-lg mb-3">{t("footerContacts")}</h3>
              <p className="text-gray-400">{t("phones")}</p>
              <p className="text-gray-400">
                <a href="tel:+79895650038">+7 (989) 565 00 38</a>
              </p>
              <p className="text-gray-400">
                <a href="tel:+375336628256">+375 33 662 82 56</a>
              </p>
              <p className="text-gray-400 mt-3">{t("email")}</p>
              <p className="text-gray-400">vladperctev@mail.ru</p>
              <p className="text-gray-400">korobko416@gmail.com</p>
            </Col>

            <Col span={24} md={3}>
              <h3 className="text-white text-lg mb-3">{t("footerAddress")}</h3>
              <p className="text-gray-400">{t("country")}</p>
              <p className="text-gray-400">{t("cityStreet")}</p>
              <p className="text-gray-400">{t("streetAddress")}</p>
            </Col>

            <Col span={24} md={3}>
              <h3 className="text-white text-lg mb-3">{t("footerInfo")}</h3>
              <ul className="space-y-1 text-gray-400">
                <li>{t("deliveryPayment")}</li>
                <li>{t("guarantees")}</li>
                <li>{t("returns")}</li>
              </ul>
            </Col>
          </Row>

          <div className="border-t border-gray-600 pt-4 text-gray-500 text-sm text-center mt-8">
            {t("footerCopyright")}
          </div>
        </div>
      </Footer>
    </div>
  );
};

export default Footers;
