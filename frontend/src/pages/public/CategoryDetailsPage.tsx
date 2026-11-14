import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuArrowRight, LuSearchX } from "react-icons/lu";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { useProductFilters } from "../../features/products/hooks/useProductFilters";
import type { CategoryListItem } from "../../types/catalog";
import { categoryItems, productItems } from "../../data/catalog.selectors";
import CategoryHero from "../../features/categories/components/CategoryHero";
import CategoryRail from "../../features/categories/components/CategoryRail";
import ProductCard from "../../features/products/components/ProductCard";
import ProductFilterSheet from "../../features/products/components/ProductFilterSheet";
import ProductToolbar from "../../features/products/components/ProductToolbar";
import Pagination from "../../components/ui/Pagination";
import CategoryCard from "../../features/categories/components/CategoryCard";
import ProductFilters from "../../features/products/components/ProductFilters";

const CategoryNotFound = () => (
  <Container className="grid place-items-center py-24 text-center">
    <div className="grid max-w-md gap-4">
      <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
        <LuSearchX size={30} />
      </span>
      <h1 className="text-3xl font-bold">Category not found</h1>
      <p className="text-muted-foreground">This category may have moved. Browse all categories to find what you need.</p>
      <Button to="/categories" className="mx-auto">
        Browse all categories <LuArrowRight size={16} className="rtl:rotate-180" />
      </Button>
    </div>
  </Container>
);

const CategoryContent = ({ category }: { category: CategoryListItem }) => {
  const f = useProductFilters({ categorySlug: category.slug });
  const [sheetOpen, setSheetOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const isEmptyCategory = f.poolSize === 0;

  const bestSellers = useMemo(
    () =>
      productItems
        .filter((p) => p.category.slug === category.slug)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 8),
    [category.slug],
  );

  // Same collection first, then the rest
  const related = useMemo(() => {
    const others = categoryItems.filter((c) => c.slug !== category.slug && c.productCount > 0);
    const same = others.filter((c) => c.collectionSlug === category.collectionSlug);
    const rest = others.filter((c) => c.collectionSlug !== category.collectionSlug);
    return [...same, ...rest].slice(0, 6);
  }, [category]);

  useEffect(() => {
    document.title = `${category.name} | SNT Supermart`;
  }, [category.name]);

  // Scroll to the top of the grid when the page number changes
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [f.page]);

  const showBestSellers = !f.hasFilters && f.page === 1 && bestSellers.length > 0;

  return (
    <div className="pb-12">
      <Container className="grid gap-6 pt-4 sm:gap-8 sm:pt-6">
        <CategoryHero category={category} f={f} />
        <CategoryRail activeSlug={category.slug} />

        {showBestSellers && (
          <section aria-labelledby="best-sellers-title" className="grid gap-4">
            <div className="flex items-end justify-between gap-4">
              <h2 id="best-sellers-title" className="text-2xl font-bold tracking-tight">
                Best sellers in {category.name}
              </h2>
              <Link to={`/category/${category.slug}?sort=popular`} className="shrink-0 text-sm font-bold text-link hover:underline">
                See all
              </Link>
            </div>
            <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:gap-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
              {bestSellers.map((p) => (
                <li key={p.id} className="w-44 shrink-0 snap-start sm:w-56">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <div ref={gridRef} className="grid scroll-mt-24 items-start gap-6 lg:grid-cols-[17rem_1fr]">
          {!isEmptyCategory && (
            <aside aria-label="Filters" className="sticky top-24 hidden rounded-3xl border border-border bg-surface px-5 py-2 shadow-card lg:block">
              <div className="flex items-center justify-between border-b border-border py-3">
                <b>Filters</b>
                {f.hasFilters && (
                  <button type="button" onClick={f.clearAll} className="text-xs font-bold text-link hover:underline">
                    Reset
                  </button>
                )}
              </div>
              <ProductFilters f={f} showCategory={false} />
            </aside>
          )}

          <div className={`grid min-w-0 gap-5 ${isEmptyCategory ? "lg:col-span-2" : ""}`}>
            {!isEmptyCategory && (
              <ProductToolbar f={f} onOpenFilters={() => setSheetOpen(true)} showCategory={false} />
            )}

            {f.items.length === 0 ? (
              <div className="grid place-items-center gap-4 rounded-3xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
                <span className="grid size-16 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
                  <LuSearchX size={30} />
                </span>
                <div className="grid gap-1.5">
                  <h2 className="text-xl font-bold">{isEmptyCategory ? "Products coming soon" : "No products match"}</h2>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    {isEmptyCategory
                      ? "We are stocking this category. Check back soon or browse another one."
                      : "Try removing a filter or widening the price range."}
                  </p>
                </div>
                {isEmptyCategory ? (
                  <Button to="/categories">Browse categories</Button>
                ) : (
                  <Button onClick={f.clearAll}>Clear all filters</Button>
                )}
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {f.items.map((p) => (
                  <li key={p.id} className="flex">
                    <div className="w-full">
                      <ProductCard product={p} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Pagination page={f.page} totalPages={f.totalPages} onChange={f.setPage} className="pt-2" />
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="grid gap-4">
            <div className="flex items-end justify-between gap-4">
              <h2 id="related-title" className="text-2xl font-bold tracking-tight">Customers also shop</h2>
              <Link to="/categories" className="shrink-0 text-sm font-bold text-link hover:underline">All categories</Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {related.map((c) => (
                <li key={c.slug}>
                  <CategoryCard category={c} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>

      <ProductFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} f={f} showCategory={false} />
    </div>
  );
};

const CategoryDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categoryItems.find((c) => c.slug === slug);

  // key resets the filter state when you switch to another category
  return category ? <CategoryContent key={category.slug} category={category} /> : <CategoryNotFound />;
};

export default CategoryDetailsPage;
