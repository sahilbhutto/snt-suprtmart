import { useMemo, useState } from "react";
import {  trendingTabs } from "../../../data/home.data";
import Container from "../../../components/ui/Container";
import ProductCard from "../../products/components/ProductCard";
import type { TrendingTab } from "../../../types/catalog";
import { cn } from "../../../lib/cn";
import { getTrendingProducts } from "../../../data/catalog.selectors";

const TrendingSection = () => {
  const [tab, setTab] = useState<TrendingTab>('trending');

 const items = useMemo(() => getTrendingProducts(tab), [tab]);

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
            <ProductCard key={p.id} product={p}/>
          ))}
        </div>
      </Container>
    </section>
  );
};


export default TrendingSection
