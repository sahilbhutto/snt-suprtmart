import type { PaginatedResponse } from "../../../types/api.types";


export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
}

export interface BrandSummary {
  id: string;
  slug: string;
  name: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export type ProductId = string;

export type BrandSlug = string;


export interface ProductSeo {
  title?: string;
  description?: string;
}


export interface Brand {
  id: string;
  slug: BrandSlug;
  name: string;
  logo?: ProductImage;
}


export interface Product {
  id: ProductId;
  slug: string;
  name: string;
  description?: string;
 categoryId: string;
  brandId: string;
  image: string;
  price: number;
  oldPrice?: number;
  unit: string;
  sku?: string;
  barcode?: string;
  stockQuantity: number;
  maxPerOrder?: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  ratingCount: number;
  sold: number;
  tags?: string[];
  seo?: ProductSeo;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDerived {
  inStock: boolean;
  discountPercent: number;
}

export interface ProductListItem extends Product, ProductDerived {
  category: CategorySummary;
  brand: BrandSummary;
}

export const PRODUCT_SORTS = ["popular", "newest", "price-asc", "price-desc", "rating", "discount"] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export const DEFAULT_PRODUCT_SORT: ProductSort = "popular";

export const PRODUCT_PAGE_SIZE = 12;

export interface ProductListQuery {
  q?: string;
  categorySlug?: string;
  brandSlugs?: BrandSlug[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sale?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface ProductFacets {
  brands: { slug: BrandSlug; name: string; count: number }[];
  priceRange: { min: number; max: number } | null;
}

export interface ProductListResponse extends PaginatedResponse<ProductListItem> {
  facets: ProductFacets;
}

export interface FlashDeal {
  productId: ProductId;
  soldPercent: number;
  endsAt: string;
}


export interface ProductCardProps {
  product: ProductListItem;
  soldPercent?: number; // only flash deals pass this
}
