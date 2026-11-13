import type { IconType } from "react-icons";
import type { PaginatedResponse } from "../../../types/api.types";


export type CategoryId = string;

export type CollectionSlug = string;

export interface CategorySeo {
  title?: string;
  description?: string;
}


export interface CategoryCollection {
  id: string;
  slug: CollectionSlug;
  name: string;
  description?: string;
  sortOrder: number;
}


export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description?: string;
  collectionSlug: CollectionSlug;
  image?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  sortOrder: number;
  popularity: number;
  trend7d?: number;
  seo?: CategorySeo;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStats {
  productCount: number;
  minPrice: number | null;
  inStock: boolean;
  hasDeals: boolean;
}

export type CategoryListItem = Category & CategoryStats;

/** @deprecated Prefer CategoryListItem – kept for gradual migration */
export type CategoryItem = CategoryListItem & {
  /** alias used by older components */
  count?: number;
};


export const CATEGORY_SORTS = ["popular", "trending", "newest", "products", "name-asc", "name-desc"] as const;

export type CategorySort = (typeof CATEGORY_SORTS)[number];

export const DEFAULT_CATEGORY_SORT: CategorySort = "popular";

export const CATEGORY_PAGE_SIZE = 24;

export interface CategoryListQuery {
  q?: string;
  collection?: CollectionSlug;
  sale?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  sort?: CategorySort;
  page?: number;
  pageSize?: number;
}

export interface CategoryFacets {
  collections: { slug: CollectionSlug; count: number }[];
}

export interface CategoryListResponse extends PaginatedResponse<CategoryListItem> {
  facets: CategoryFacets;
}
