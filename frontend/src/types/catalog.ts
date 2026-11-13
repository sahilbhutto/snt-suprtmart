import type { IconType } from "react-icons";
export type Tint = 1 | 2 | 3 | 4 | 5 | 6;

export type CartState = Record<string, number>;

export type TrendingTab = "trending" | "new" | "top-rated" | "under-500";

export type PromoTone = "ink" | "tint2" | "tint3" | "tint4";

export interface PromoTile {
  id: string;
  to: string;
  badge: string;
  title: string;
  text: string;
  meta?: string;
  icon: IconType;
  tone: PromoTone;
  area: string;
}

export interface Referral {
  title: string;
  text: string;
  cta: string;
  to: string;
}

export interface PaymentOffer {
  title?: string;
  text?: string;
  methods: string[];
  cta?: string;
  to?: string;

  // will be remove if compoenet promo removed from home page
  code: "PAYJC",
  amount: "Rs. 150",
  minOrder: "Rs. 1,000",
}

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  title: string;
  caption: string;
}

export interface TrustItem {
  icon: IconType;
  title: string;
  text: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  area: string;
  rating: number;
}

export interface NavItem {
  label: string;
  to: string;
  highlight?: boolean;
}

export interface FooterLink {
  label: string;
  to: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface AisleGroup {
  title: string;
  links: { label: string; count: number; slug: string }[];
}

export interface AisleLink {
  label: string;
  slug: string;
  count: number;
  fromPrice: number;
  trend?: number;
  isNew?: boolean;
}

export interface Aisle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  icon: IconType;
  tint: Tint;
  productCount: number;
  brands: string[];
  image?: string;
  links: AisleLink[];
}

// Re-export category list item for older imports
export type {
  CategoryListItem as CategoryItem,
  CategoryListItem,
  Category,
} from "../features/categories/types/categories.types";

// Re-export product types for older imports
export type {
  Product,
  ProductListItem,
} from "../features/products/types/products.types";
