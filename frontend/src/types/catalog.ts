import type { IconType } from "react-icons";

export type Tint = 1 | 2 | 3 | 4 | 5 | 6;

export type CartState = Record<string, number>;

export type TrendingTab = 'trending' | 'new' | 'top-rated' | 'under-500';


export interface Product {
  id: string;
  slug: string;
  name: string;
  unit: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  rating: number;
  sold: number;
  tint: Tint;
  image: string;
  /** Only used by flash deals (0 - 100) */
  soldPercent?: number;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
  icon: IconType;
  tint: Tint;
  image?: string;
}

export interface NavItem {
  label: string;
  to: string;
  highlight?: boolean;
}

export interface ProductCardProps {
  product: Product;
  showProgress?: boolean;
}

export type PromoTone = "ink" | "tint2" | "tint3" | "tint4";

export interface PromoTile {
  id: string;
  to: string;            // where the tile links
  badge: string;         // small pill, e.g. "Save up to 15%"
  title: string;
  text: string;
  meta?: string;         // optional line with a dot, e.g. "Free delivery"
  icon: IconType;        // faded watermark icon
  tone: PromoTone;       // colour style, see PromoBentoSection
  area: string;          // grid width on large screens, e.g. "lg:col-span-4"
}

export interface Referral {
  title: string;
  text: string;
  cta: string;
  to: string;
}

export interface PaymentOffer {
  code: string;
  amount: string;
  minOrder: string;
  methods: string[];
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
  trend?: number;      // growth this week in %, e.g. 14
  isNew?: boolean;
}

export interface Aisle {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  icon: IconType;
  tint: Tint;          // your existing 1 to 6 tint type
  productCount: number;
  brands: string[];
  image?: string;      // optional aisle photo, shown as a thumbnail
  links: AisleLink[];
}

export interface TrustItem {
  icon: IconType;
  title: string;
  text: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  area: string;
  rating: number;
}

export interface FooterColumn {
  title: string;
  links: { label: string; to: string }[];
}
