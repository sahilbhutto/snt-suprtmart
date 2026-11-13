import { useEffect, useRef } from "react";
import { useCategoryFilters } from "../../features/categories/hooks/useCategoryFilters";
import Container from "../../components/ui/Container";
import CategoriesHero from "../../features/categories/components/CategoriesHero";
import CategoryToolbar from "../../features/categories/components/CategoryToolbar";
import CategoriesEmpty from "../../features/categories/components/CategoriesEmpty";
import CategoryCard from "../../features/categories/components/CategoryCard";
import Pagination from "../../components/ui/Pagination";
import { cn } from "../../lib/cn";
import RequestBand from "../../features/categories/components/RequestBand";

const AllCategoriesPage = () => {
  const f = useCategoryFilters();
  const gridRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.title = "All categories | SNT Supermart";
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [f.page]);

  return (
        <>
      <Container className="grid gap-6 pt-4 sm:gap-8 sm:pt-6">
        <CategoriesHero q={f.q} onQueryChange={f.setQuery} />

        <div ref={gridRef} className="grid scroll-mt-28 gap-5">
          <CategoryToolbar
            q={f.q}
            sort={f.sort}
            sale={f.sale}
            isNew={f.isNew}
            total={f.total}
            allCount={f.allCount}
            facets={{}}
            activeCount={f.activeCount}
            onSort={f.setSort}
            onToggleSale={f.toggleSale}
            onToggleNew={f.toggleNew}
            onClearQuery={f.clearQuery}
            onClearAll={f.clearAll}
          />

          {f.items.length === 0 ? (
            <CategoriesEmpty onClear={f.clearAll} />
          ) : (
            <ul
              className={cn(
                "grid grid-cols-2 gap-3 transition-opacity sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6",
                f.isStale && "opacity-60",
              )}
            >
              {f.items.map((c) => (
                <li key={c.slug}>
                  <CategoryCard category={c} />
                </li>
              ))}
            </ul>
          )}

          <Pagination page={f.page} totalPages={f.totalPages} onChange={f.setPage} className="pt-2" />
        </div>

        <RequestBand />
      </Container>
    </>
  );
};

export default AllCategoriesPage;
