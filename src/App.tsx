import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Wholesale from "./pages/Wholesale";
import AboutUs from "./pages/AboutUs";
import Categories from "./pages/Categories";
import LoginPage from "./login";
import Register from "./Register";
import Profile from "./Profile";
import Payment from "./pages/Payment";
import Header from "./components/Headers";
import ProductDetails from "./pages/Productdetail";
import Order from "./pages/Order";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  gift?: string;
};

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("accessToken");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Header
          isDesktop={true}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/order" element={<Order />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/product/:id"
            element={<ProductDetails addToCart={addToCart} />}
          />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/Katalog/Category" element={<Categories />} />
          <Route path="/product/:categoryTitle" element={<Product />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
