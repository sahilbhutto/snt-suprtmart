import type {
  HeroSlide,
  Testimonial,
  TrendingTab,
  TrustItem,
} from "../types/catalog";
import { LuTruck, LuWallet, LuUndo2, LuLeaf } from "react-icons/lu";
import shop1 from "../assets/images/banner1.webp";
import shop2 from "../assets/images/banner2.webp";
import shop3 from "../assets/images/banner3.webp";
import shop4 from "../assets/images/banner4.webp";
import shop5 from "../assets/images/banner5.webp";
import shop6 from "../assets/images/banner6.webp";


export const heroSlides: HeroSlide[] = [
  { id: "store-front", image: shop1, alt: "SNT Supermart store front", title: "Our flagship store", caption: "Open every day, 8 AM to 11 PM" },
  { id: "fresh", image: shop2, alt: "Fresh fruit and vegetable aisle", title: "Fresh produce aisle", caption: "Picked and checked every morning" },
  { id: "dairy", image: shop3, alt: "Dairy and chilled section", title: "Dairy and chilled", caption: "Kept cold from shelf to door" },
  { id: "pantry", image: shop4, alt: "Pantry and grocery aisle", title: "Pantry essentials", caption: "Rice, oil, flour and 18,000 more" },
  { id: "packing", image: shop5, alt: "Order packing area", title: "Packed in minutes", caption: "Every order is double-checked" },
  { id: "riders", image: shop6, alt: "Delivery riders", title: "Our delivery team", caption: "Live tracking from store to door" },
];


export const trustItems: TrustItem[] = [
  { icon: LuTruck, title: "2-hour delivery", text: "Same-day in your zone" },
  { icon: LuLeaf, title: "Freshness promise", text: "Checked before dispatch" },
  {
    icon: LuWallet,
    title: "Pay your way",
    text: "COD, Easypaisa, JazzCash, cards",
  },
  {
    icon: LuUndo2,
    title: "Easy returns",
    text: "Report issues within 24 hours",
  },
];

export const trendingTabs: { key: TrendingTab; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
  { key: "top-rated", label: "Top rated" },
  { key: "under-500", label: "Under Rs. 500" },
];
