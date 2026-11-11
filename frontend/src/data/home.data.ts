import type {
  AisleGroup,
  Category,
  FooterColumn,
  NavItem,
  Product,
  Testimonial,
  TrendingTab,
  TrustItem,
} from "../types/catalog";
import { LuTruck, LuWallet, LuUndo2, LuLeaf } from "react-icons/lu";
import { IoEggSharp } from "react-icons/io5";
import { GiCannedFish } from "react-icons/gi";
import { FaBottleWater } from "react-icons/fa6";
import { PiGrainsBold } from "react-icons/pi";
import { GiChipsBag } from "react-icons/gi";
import { GiCupcake } from "react-icons/gi";
import { GiOpenedFoodCan } from "react-icons/gi";
import { FaBaby } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { TbPerfume } from "react-icons/tb";
import { PiDogFill } from "react-icons/pi";
import { GiFruitBowl } from "react-icons/gi";
import type { HeroSlide } from "../types/hero";



import shop1 from "../assets/images/banner1.webp";
import shop2 from "../assets/images/banner2.webp";
import shop3 from "../assets/images/banner3.webp";
import shop4 from "../assets/images/banner4.webp";
import shop5 from "../assets/images/banner5.webp";
import shop6 from "../assets/images/banner6.webp";




export const navItems: NavItem[] = [
  { label: "Fruits & Veg", to: "/category/fruits-veg" },
  { label: "Dairy & Eggs", to: "/category/dairy-eggs" },
  { label: "Meat", to: "/category/meat" },
  { label: "Beverages", to: "/category/beverages" },
  { label: "Pantry", to: "/category/pantry" },
  { label: "Snacks", to: "/category/snacks" },
  { label: "Household", to: "/category/household" },
  { label: "Deals", to: "/deals", highlight: true },
];

export const categories: Category[] = [
  {
    slug: "fruits-veg",
    name: "Fruits & Veg",
    count: 4120,
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=85",
    tint: 1,
    icon: GiFruitBowl,
  },
  {
    slug: "dairy-eggs",
    name: "Dairy & Eggs",
    count: 2310,
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=85",
    tint: 2,
    icon: IoEggSharp,
  },
  {
    slug: "meat-fish",
    name: "Meat & Fish",
    count: 1480,
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85",
    tint: 4,
    icon: GiCannedFish,
  },
  {
    slug: "beverages",
    name: "Beverages",
    count: 6905,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=85",
    tint: 3,
    icon: FaBottleWater,
  },
  {
    slug: "pantry",
    name: "Pantry",
    count: 18640,
    image:
      "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=600&q=85&auto=format&fit=crop",
    tint: 6,
    icon: PiGrainsBold,
  },
  {
    slug: "snacks",
    name: "Snacks",
    count: 7210,
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=85",
    tint: 2,
    icon: GiChipsBag,
  },
  {
    slug: "bakery",
    name: "Bakery",
    count: 1360,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=85",
    tint: 6,
    icon: GiCupcake,
  },
  {
    slug: "frozen",
    name: "Frozen",
    count: 2040,
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=85",
    tint: 3,
    icon: GiOpenedFoodCan,
  },
  {
    slug: "baby",
    name: "Baby",
    count: 3120,
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=85",
    tint: 4,
    icon: FaBaby,
  },
  {
    slug: "household",
    name: "Household",
    count: 9880,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=85",
    tint: 5,
    icon: FaHouseChimney,
  },
  {
    slug: "personal-care",
    name: "Personal care",
    count: 8430,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=85",
    tint: 5,
    icon: TbPerfume,
  },
  {
    slug: "pet",
    name: "Pet",
    count: 1150,
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=85",
    tint: 1,
    icon: PiDogFill,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "basmati-rice-5kg",
    name: "Basmati Rice",
    unit: "5 kg",
    price: 1850,
    oldPrice: 2100,
    badge: "Save 12%",
    rating: 4.7,
    sold: 3400,
    tint: 1,
    image:
      "https://images.unsplash.com/photo-1531339061898-6aac90df037e?w=600&q=85&auto=format&fit=crop",
    soldPercent: 72,
  },
  {
    id: "p2",
    slug: "fresh-milk-1l",
    name: "Fresh Milk",
    unit: "1 L",
    price: 290,
    rating: 4.8,
    sold: 12800,
    tint: 2,
    image:
      "https://images.unsplash.com/photo-1643114453626-97ae781657b6?w=600&q=85&auto=format&fit=crop",
    soldPercent: 45,
  },
  {
    id: "p3",
    slug: "cooking-oil-5l",
    name: "Cooking Oil",
    unit: "5 L",
    price: 2650,
    oldPrice: 2900,
    badge: "Save 8%",
    rating: 4.6,
    sold: 2100,
    tint: 6,
    image:
      "https://images.unsplash.com/photo-1763704189952-660d9055abbb?w=600&q=85&auto=format&fit=crop",
    soldPercent: 88,
  },
  {
    id: "p4",
    slug: "tea-leaves-950g",
    name: "Tea Leaves",
    unit: "950 g",
    price: 1420,
    badge: "Best seller",
    rating: 4.7,
    sold: 5200,
    tint: 4,
    image:
      "https://images.unsplash.com/photo-1760074057746-388f7e66c61e?w=600&q=85&auto=format&fit=crop",
    soldPercent: 31,
  },
  {
    id: "p5",
    slug: "mineral-water-6x15l",
    name: "Mineral Water",
    unit: "1.5 L x 6",
    price: 540,
    rating: 4.5,
    sold: 8900,
    tint: 3,
    image:
      "https://images.unsplash.com/photo-1728512552043-51d51e7aa9f8?w=600&q=85&auto=format&fit=crop",
    soldPercent: 60,
  },
  {
    id: "p6",
    slug: "brown-eggs-12",
    name: "Brown Eggs",
    unit: "12 pcs",
    price: 410,
    oldPrice: 450,
    badge: "Save 9%",
    rating: 4.8,
    sold: 9100,
    tint: 2,
    image:
      "https://images.unsplash.com/photo-1641999161954-f6a92e137b84?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "p7",
    slug: "red-apples-1kg",
    name: "Red Apples",
    unit: "1 kg",
    price: 360,
    badge: "Fresh",
    rating: 4.6,
    sold: 4300,
    tint: 1,
    image:
      "https://images.unsplash.com/photo-1782245081416-b883f27e3d6b?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "p8",
    slug: "chicken-breast-1kg",
    name: "Chicken Breast",
    unit: "1 kg",
    price: 980,
    rating: 4.5,
    sold: 3800,
    tint: 4,
    image:
      "https://images.unsplash.com/photo-1633096013004-e2cb4023b560?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "p9",
    slug: "wheat-flour-10kg",
    name: "Whole Wheat Flour",
    unit: "10 kg",
    price: 1320,
    badge: "New",
    rating: 4.4,
    sold: 1900,
    tint: 6,
    image:
      "https://images.unsplash.com/photo-1531339061898-6aac90df037e?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "p10",
    slug: "green-tea-bags-100",
    name: "Green Tea Bags",
    unit: "100 pcs",
    price: 690,
    oldPrice: 780,
    badge: "Save 11%",
    rating: 4.9,
    sold: 2600,
    tint: 1,
    image:
      "https://images.unsplash.com/photo-1760074057746-388f7e66c61e?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "p11",
    slug: "yogurt-1kg",
    name: "Yogurt",
    unit: "1 kg",
    price: 310,
    rating: 4.6,
    sold: 7200,
    tint: 3,
    image:
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "p12",
    slug: "mixed-fruit-juice-1l",
    name: "Mixed Fruit Juice",
    unit: "1 L",
    price: 340,
    oldPrice: 380,
    badge: "Save 10%",
    rating: 4.3,
    sold: 3100,
    tint: 2,
    image:
      "https://images.unsplash.com/photo-1659204958264-369d15460b4a?w=600&q=85&auto=format&fit=crop",
  },
];

export const heroSlides: HeroSlide[] = [
  { id: "store-front", image: shop1, alt: "SNT Supermart store front", title: "Our flagship store", caption: "Open every day, 8 AM to 11 PM" },
  { id: "fresh", image: shop2, alt: "Fresh fruit and vegetable aisle", title: "Fresh produce aisle", caption: "Picked and checked every morning" },
  { id: "dairy", image: shop3, alt: "Dairy and chilled section", title: "Dairy and chilled", caption: "Kept cold from shelf to door" },
  { id: "pantry", image: shop4, alt: "Pantry and grocery aisle", title: "Pantry essentials", caption: "Rice, oil, flour and 18,000 more" },
  { id: "packing", image: shop5, alt: "Order packing area", title: "Packed in minutes", caption: "Every order is double-checked" },
  { id: "riders", image: shop6, alt: "Delivery riders", title: "Our delivery team", caption: "Live tracking from store to door" },
];

export const aisleGroups: AisleGroup[] = [
  {
    title: "Pantry",
    links: [
      { label: "Rice and grains", count: 1248, slug: "rice-grains" },
      { label: "Cooking oil", count: 612, slug: "cooking-oil" },
      { label: "Flour and baking", count: 540, slug: "flour-baking" },
      { label: "Pulses", count: 388, slug: "pulses" },
      { label: "Spices", count: 920, slug: "spices" },
    ],
  },
  {
    title: "Fresh",
    links: [
      { label: "Fruits", count: 640, slug: "fruits" },
      { label: "Vegetables", count: 720, slug: "vegetables" },
      { label: "Meat", count: 410, slug: "meat" },
      { label: "Sea food", count: 190, slug: "sea-food" },
      { label: "Bakery", count: 360, slug: "bakery" },
    ],
  },
  {
    title: "Drinks and snacks",
    links: [
      { label: "Tea and coffee", count: 780, slug: "tea-coffee" },
      { label: "Juices", count: 520, slug: "juices" },
      { label: "Biscuits", count: 1140, slug: "biscuits" },
      { label: "Chips", count: 610, slug: "chips" },
      { label: "Chocolates", count: 880, slug: "chocolates" },
    ],
  },
  {
    title: "Home and care",
    links: [
      { label: "Cleaning", count: 1420, slug: "cleaning" },
      { label: "Laundry", count: 560, slug: "laundry" },
      { label: "Skin care", count: 2100, slug: "skin-care" },
      { label: "Hair care", count: 1350, slug: "hair-care" },
      { label: "Baby care", count: 980, slug: "baby-care" },
    ],
  },
];

export const brands = [
  "Sunfresh",
  "Golden Grain",
  "Pure Dairy",
  "Green Valley",
  "Daily Oil",
  "Tea House",
  "Crisp Bites",
  "Home Care",
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

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "Order arrived in under two hours and everything was fresh.",
    name: "Ayesha K.",
    area: "Gulshan",
    rating: 5,
  },
  {
    id: "t2",
    quote: "Paying with JazzCash was quick and the rider was polite.",
    name: "Bilal A.",
    area: "DHA",
    rating: 5,
  },
  {
    id: "t3",
    quote: "I reorder my monthly list in a few taps.",
    name: "Sana M.",
    area: "Clifton",
    rating: 5,
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/products" },
      { label: "All categories", to: "/categories" },
      { label: "Deals", to: "/deals" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track order", to: "/track" },
      { label: "Delivery areas", to: "/help#delivery" },
      { label: "FAQ", to: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", to: "/legal/terms" },
      { label: "Privacy", to: "/legal/privacy" },
      { label: "Refunds", to: "/legal/refunds" },
    ],
  },
];

export const paymentMethods = [
  "COD",
  "Easypaisa",
  "JazzCash",
  "Visa",
  "Mastercard",
];

export const trendingTabs: { key: TrendingTab; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
  { key: "top-rated", label: "Top rated" },
  { key: "under-500", label: "Under Rs. 500" },
];

export const flashDeals = products.slice(0, 5);
