import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import MainLayout from "./components/layout/main/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import CategoriesPage from "./pages/public/CategoriesPage";
import CategoryDetailsPage from "./pages/public/CategoryDetailsPage";
import ProductsPage from "./pages/public/ProductsPage";
import ProductDetailPage from "./pages/public/ProductDetailPage";
import CartPage from "./pages/public/CartPage";
import CheckoutLayout from "./components/layout/checkout/CheckoutLayout";
import CheckoutPage from "./pages/public/CheckoutPage";
import OrderSuccessPage from "./pages/public/OrderSuccessPage";
import RequireAuth from "./features/auth/components/RequireAuth";
import LoginPage from "./pages/public/LoginPage";

const App = () => (
  <Routes>
    {/* Start Main Public Layout */}
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="category/:slug" element={<CategoryDetailsPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="product/:slug" element={<ProductDetailPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />

      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    {/* End Main Public Layout */}

    {/* Start Checkout Layout */}
    <Route element={<RequireAuth />}>
      <Route element={<CheckoutLayout />}>
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success/:orderNumber" element={<OrderSuccessPage />}/>
      </Route>
    </Route>
    {/* End Checkout Layout */}
    
  </Routes>
);

export default App;
