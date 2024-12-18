import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Wholesale from "./pages/Wholesale";
import AboutUs from "./pages/AboutUs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Categories from "./pages/Categories";
import LoginPage from "./login";
import Register from "./Register";
import Profile from "./Profile";
import Payment from "./pages/Payment";
import ProductDetails from "./pages/Productdetail";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = !!sessionStorage.getItem("access_token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
            <Route path="/profile" element={<Profile />} />
          <Route path="/Katalog/Category" element={<Categories />} />
          <Route path="/product/:categoryTitle" element={<Product />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
