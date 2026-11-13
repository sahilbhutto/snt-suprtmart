import { memo } from "react";
import { Link } from "react-router-dom";
import { LuArrowUpRight } from "react-icons/lu";
import CategoryImage from "./CategoryImage";
import { cn } from "../../../lib/cn";
import { formatCount } from "../../../lib/format";
import type { CategoryListItem } from "../types/categories.types";

const CategoryCard = ({ category }: { category: CategoryListItem }) => (
  <Link
    to={`/category/${category.slug}`}
    aria-label={`View ${category.name}, ${formatCount(category.productCount)} products`}
    className="group flex h-full flex-col gap-3 rounded-3xl border border-border bg-surface p-2.5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="relative overflow-hidden rounded-2xl">
      <CategoryImage
        category={category}
        className={cn("rounded-2xl transition duration-500 group-hover:scale-105", !category.inStock && "opacity-60 grayscale")}
      />

      <div className="absolute start-2 top-2 flex flex-col items-start gap-1">
        {category.isNew && (
          <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">New</span>
        )}
        {category.hasDeals && (
          <span className="rounded-full bg-deal-soft px-2.5 py-1 text-[11px] font-bold text-deal">Deals</span>
        )}
        {!category.inStock && (
          <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-muted-foreground">Out of stock</span>
        )}
      </div>

      <span className="absolute bottom-2 end-2 grid size-9 shrink-0 aspect-square place-items-center rounded-full bg-surface text-foreground shadow-card transition duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
        <LuArrowUpRight size={16} className="rtl:-scale-x-100" />
      </span>
    </div>

    <div className="px-1.5 pb-1.5 leading-tight">
      <b className="block truncate text-sm sm:text-base">{category.name}</b>
      <span className="text-xs text-muted-foreground">{formatCount(category.productCount)} products</span>
    </div>
  </Link>
);

export const CategoryCardSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-3 rounded-3xl border border-border bg-surface p-2.5">
    <div className="aspect-square rounded-2xl bg-surface-muted" />
    <div className="grid gap-2 px-1.5 pb-1.5">
      <div className="h-4 w-3/4 rounded bg-surface-muted" />
      <div className="h-3 w-1/2 rounded bg-surface-muted" />
    </div>
  </div>
);

export default memo(CategoryCard);
