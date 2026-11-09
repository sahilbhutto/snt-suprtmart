import { useMemo, useState } from "react";
import { products, trendingTabs } from "../../../data/home.data";
import Container from "../../../components/ui/Container";
import ProductCard from "../../../components/product/ProductCard";
import type { CartState, TrendingTab } from "../../../types/catalog";
import { cn } from "../../../lib/cn";

const TrendingSection = ({ cart, onAdd, onRemove }: { cart: CartState; onAdd: (id: string) => void; onRemove: (id: string) => void }) => {
  const [tab, setTab] = useState<TrendingTab>('trending');

  const items = useMemo(() => {
    switch (tab) {
      case 'new':
        return products.filter((p) => p.badge === 'New' || p.badge === 'Fresh').concat(products.slice(5, 10)).slice(0, 10);
      case 'top-rated':
        return [...products].sort((a, b) => b.rating - a.rating).slice(0, 10);
      case 'under-500':
        return products.filter((p) => p.price < 500).slice(0, 10);
      default:
        return [...products].sort((a, b) => b.sold - a.sold).slice(0, 10);
    }
  }, [tab]);

  return (
    <section>
      <Container className="py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Trending now</h2>
          <div role="tablist" aria-label="Product lists" className="flex flex-wrap gap-2">
            {trendingTabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'rounded-full px-4 py-2 text-[13px] font-bold transition',
                  tab === t.key ? 'bg-ink text-ink-foreground' : 'border border-border bg-surface hover:border-border-strong',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} quantity={cart[p.id] ?? 0} onAdd={onAdd} onRemove={onRemove} />
          ))}
        </div>
      </Container>
    </section>
  );
};


export default TrendingSection
