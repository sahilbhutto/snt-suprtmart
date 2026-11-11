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
import CartDrawer from '../../components/cart/CartDrawer';



const HomePage = () => {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <Header/>
      <CartDrawer />

      <main>
        <HeroSection />
        <CategoryGridSection />
        <FlashDealsSection/>
        <PromoBentoSection />
        <AislesSection />
        <TrendingSection/>
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
