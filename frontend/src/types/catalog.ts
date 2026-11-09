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
  image: string;
  tint: Tint;
}

export interface NavItem {
  label: string;
  to: string;
  highlight?: boolean;
}

export interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  showProgress?: boolean;
}

export interface AisleGroup {
  title: string;
  links: { label: string; count: number; slug: string }[];
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
