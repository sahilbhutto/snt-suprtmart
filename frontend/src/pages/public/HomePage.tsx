import HeroSection from '../../features/home/sections/HeroSection';
import CategoryGridSection from '../../features/home/sections/CategoryGridSection';
import FlashDealsSection from '../../features/home/sections/FlashDealsSection';
import PromoBentoSection from '../../features/home/sections/PromoBentoSection';
import TrendingSection from '../../features/home/sections/TrendingSection';
import TestimonialsSection from '../../features/home/sections/TestimonialsSection';


const HomePage = () => {

  return (
    <>
        <HeroSection />
        <CategoryGridSection />
        <TrendingSection/>
        <FlashDealsSection/>
        <PromoBentoSection />
        <TestimonialsSection />
    </>
  );
};

export default HomePage;
