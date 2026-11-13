import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuSearchX } from "react-icons/lu";
import Button from "../../components/ui/Button";
import { useCategoryProducts } from "../../features/categories/hooks/useCategoryProducts";
import type { CategoryItem } from "../../types/catalog";
import { categoryItems } from "../../features/categories/hooks/useCategoryFilters";
import Container from "../../components/ui/Container";
import CategoryHero from "../../features/categories/components/CategoryHero";
import CategoryRail from "../../features/categories/components/CategoryRail";
import ProductCard from "../../features/products/components/ProductCard";
import ProductFilters from "../../features/categories/components/ProductFilters";
import ProductToolbar from "../../features/categories/components/ProductToolbar";
import Pagination from "../../components/ui/Pagination";
import CategoryCard from "../../features/categories/components/CategoryCard";
import FilterSheet from "../../features/categories/components/FilterSheet";
import CategoryNotFound from "../../features/categories/components/CategoryNotFound";


const CategoryContent = ({ category }: { category: CategoryItem }) => {
  const f = useCategoryProducts(category);
  const [sheetOpen, setSheetOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    document.title = `${category.name} | SNT Supermart`;
  }, [category.name]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [f.page]);

  const related = useMemo(() => {
    const others = categoryItems.filter((c) => c.slug !== category.slug);
    const same = others.filter((c) => c.collectionSlug === category.collectionSlug);
    const rest = others.filter((c) => c.collectionSlug !== category.collectionSlug);
    return [...same, ...rest].slice(0, 6);
  }, [category]);

  return (
    <main className="pb-12">
      <Container className="grid gap-6 pt-4 sm:gap-8 sm:pt-6">
        <CategoryHero category={category} f={f} />
        <CategoryRail activeSlug={category.slug} />

        <div ref={gridRef} className="grid scroll-mt-24 items-start gap-6 lg:grid-cols-[17rem_1fr]">
          {/* Desktop filters */}
          <aside aria-label="Filters" className="sticky top-24 hidden rounded-3xl border border-border bg-surface px-5 py-2 shadow-card lg:block">
            <div className="flex items-center justify-between border-b border-border py-3">
              <b>Filters</b>
              {f.hasFilters && (
                <button type="button" onClick={f.clearAll} className="text-xs font-bold text-link hover:underline">
                  Reset
                </button>
              )}
            </div>
            <ProductFilters f={f} />
          </aside>

          <div className="grid min-w-0 gap-5">
            <ProductToolbar f={f} onOpenFilters={() => setSheetOpen(true)} />

            {f.items.length === 0 ? (
              <div className="grid place-items-center gap-4 rounded-3xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
                <span className="grid size-16 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
                  <LuSearchX size={30} />
                </span>
                <div className="grid gap-1.5">
                  <h2 className="text-xl font-bold">No products match</h2>
                  <p className="max-w-sm text-sm text-muted-foreground">Try removing a filter or widening the price range.</p>
                </div>
                <Button onClick={f.clearAll}>Clear all filters</Button>
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

      </Container>

      <FilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} f={f} />
    </main>
  );
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categoryItems.find((c) => c.slug === slug);

  return category ? <CategoryContent key={category.slug} category={category} /> : <CategoryNotFound />;
};

export default CategoryPage;
