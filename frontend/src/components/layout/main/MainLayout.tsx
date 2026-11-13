import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../../../features/cart/components/CartDrawer";

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-background text-foreground">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink-foreground"
    >
      Skip to content
    </a>

    <AnnouncementBar />
    <Header />

    <main id="main-content" className="flex-1">
      <Outlet />
    </main>

    <Footer />
    <CartDrawer />
  </div>
);

export default MainLayout;
