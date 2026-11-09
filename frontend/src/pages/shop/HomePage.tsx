import { useState } from 'react';
import { products } from '../../data/home.data';
import type { CartState } from '../../types/catalog';
import AnnouncementBar from '../../components/layout/AnnouncementBar';
import Header from '../../components/layout/Header';
import HeroSection from '../../features/home/sections/HeroSection';
import CategoryGridSection from '../../features/home/sections/CategoryGridSection';
import FlashDealsSection from '../../features/home/sections/FlashDealsSection';
import PromoBentoSection from '../../features/home/sections/PromoBentoSection';
import AislesSection from '../../features/home/sections/AislesSection';
import TrendingSection from '../../features/home/sections/TrendingSection';
import BrandsSection from '../../features/home/sections/BrandsSection';
import TrustSection from '../../features/home/sections/TrustSection';
import AppBannerSection from '../../features/home/sections/AppBannerSection';
import TestimonialsSection from '../../features/home/sections/TestimonialsSection';
import Footer from '../../components/layout/Footer';


const productById = new Map(products.map((p) => [p.id, p]));

const HomePage = () => {
  const [cart, setCart] = useState<CartState>({});

  const handleAdd = (id: string) => setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const handleRemove = (id: string) =>
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, q]) => sum + (productById.get(id)?.price ?? 0) * q, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <Header cartCount={cartCount} cartTotal={cartTotal} />

      <main>
        <HeroSection />
        <CategoryGridSection />
        <FlashDealsSection cart={cart} onAdd={handleAdd} onRemove={handleRemove} />
        <PromoBentoSection />
        <AislesSection />
        <TrendingSection cart={cart} onAdd={handleAdd} onRemove={handleRemove} />
        <BrandsSection />
        <TrustSection />
        <AppBannerSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
