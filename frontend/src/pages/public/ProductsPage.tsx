import { useEffect, useRef, useState } from "react";
import { LuSearchX } from "react-icons/lu";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import Pagination from "../../components/ui/Pagination";
import { cn } from "../../lib/cn";
import { useProductFilters } from "../../features/products/hooks/useProductFilters";
import ProductsHero from "../../features/products/components/ProductsHero";
import ProductFilters from "../../features/products/components/ProductFilters";
import ProductToolbar from "../../features/products/components/ProductToolbar";
import ProductCard from "../../features/products/components/ProductCard";
import ProductFilterSheet from "../../features/products/components/ProductFilterSheet";

const ProductsPage = () => {
  const f = useProductFilters();
  const [sheetOpen, setSheetOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    document.title = "All products | SNT Supermart";
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [f.page]);

  return (
    <div className="pb-12">
      <Container className="grid gap-6 pt-4 sm:gap-8 sm:pt-6">
        <ProductsHero q={f.q} onQueryChange={f.setQuery} />

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
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Try a different word, or remove a filter to see more products.
                  </p>
                </div>
                <Button onClick={f.clearAll}>Clear all filters</Button>
              </div>
            ) : (
              <ul
                className={cn(
                  "grid grid-cols-2 gap-3 transition-opacity sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
                  f.isStale && "opacity-60",
                )}
              >
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

      <ProductFilterSheet open={sheetOpen} onClose={() => setSheetOpen(false)} f={f} />
    </div>
  );
};

export default ProductsPage;
