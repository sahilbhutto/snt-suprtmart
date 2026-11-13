import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/public/HomePage"
import CategoryPage from "./pages/public/CategoryPage"
import MainLayout from "./components/layout/main/MainLayout"
import NotFoundPage from "./pages/NotFoundPage"
import AllCategoriesPage from "./pages/public/AllCategoriesPage"

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path="categories" element={<AllCategoriesPage />} />
      <Route path="category/:slug" element={<CategoryPage />} />

      <Route path="*" element={<NotFoundPage />} />

    </Route>
  </Routes>
)

export default App
