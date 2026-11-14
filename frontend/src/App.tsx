import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/public/HomePage"
import MainLayout from "./components/layout/main/MainLayout"
import NotFoundPage from "./pages/NotFoundPage"
import CategoriesPage from "./pages/public/CategoriesPage"
import CategoryDetailsPage from "./pages/public/CategoryDetailsPage"
import ProductsPage from "./pages/public/ProductsPage"
import ProductDetailPage from "./pages/public/ProductDetailPage"

const App = () => (
  <Routes>

    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="category/:slug" element={<CategoryDetailsPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="product/:slug" element={<ProductDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>

  </Routes>
)

export default App
