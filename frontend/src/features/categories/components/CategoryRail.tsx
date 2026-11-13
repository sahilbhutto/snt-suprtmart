import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LuLayoutGrid } from "react-icons/lu";
import CategoryImage from "./CategoryImage";
import { cn } from "../../../lib/cn";
import { categoryItems } from "../hooks/useCategoryFilters";

/** Horizontal strip to hop between categories without going back */
const CategoryRail = ({ activeSlug }: { activeSlug: string }) => {
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [activeSlug]);

  return (
    <nav aria-label="Browse categories" className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
      <Link
        to="/categories"
        className="flex shrink-0 snap-start items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-ink-foreground"
      >
        <LuLayoutGrid size={16} className="text-accent" /> All categories
      </Link>

      {categoryItems.map((c) => {
        const active = c.slug === activeSlug;
        return (
          <Link
            key={c.slug}
            ref={active ? activeRef : undefined}
            to={`/category/${c.slug}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 snap-start items-center gap-2 rounded-full border py-1.5 pe-4 ps-1.5 text-sm font-semibold transition",
              active ? "border-primary bg-primary-soft text-link" : "border-border bg-surface hover:border-border-strong",
            )}
          >
            <CategoryImage category={c} className="size-8 rounded-full" />
            {c.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default CategoryRail;
