import { useRef, useState } from "react";
import { categories, products } from "../../data/home.data";
import { LuArrowUpRight, LuChevronDown, LuChevronRight, LuMenu } from "react-icons/lu";
import { cn } from "../../lib/cn";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import ProductImage from "../product/ProductImage";
import { formatCount, formatPrice, tintBg } from "../../lib/format";
import useClickOutside from "../../hooks/useClickOutside";
import CategoryImage from "../product/CategoryImage";


const productCategory: Record<string, string> = {
  p1: 'pantry', p2: 'dairy-eggs', p3: 'pantry', p4: 'beverages', p5: 'beverages', p6: 'dairy-eggs',
  p7: 'fruits-veg', p8: 'meat-fish', p9: 'pantry', p10: 'beverages', p11: 'dairy-eggs', p12: 'beverages',
};

const topPicksFor = (slug: string) => {
  const inCategory = products.filter((p) => productCategory[p.id] === slug);
  const list = inCategory.length ? inCategory : [...products].sort((a, b) => b.sold - a.sold);
  return list.slice(0, 3);
};

const CategoryMenu = () => {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(categories[0].slug);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  const active = categories.find((c) => c.slug === activeSlug) ?? categories[0];
  const picks = topPicksFor(active.slug);
  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="category-menu"
        className={cn('flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-ink-foreground transition', open && 'ring-2 ring-accent')}
      >
        <LuMenu size={16} className="text-accent" />
        All categories
        <LuChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div id="category-menu" className="absolute left-0 top-full z-50 mt-3 grid w-[min(980px,calc(100vw-2rem))] grid-cols-[280px_1fr] overflow-hidden rounded-3xl border border-border bg-surface shadow-pop">
          {/* Left: category list */}
          <div className="max-h-[430px] overflow-y-auto border-r border-border p-3">
            <p className="px-3 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">Categories</p>
            {categories.map((c) => {
              const Icon = c.icon;
              const isActive = c.slug === active.slug;
              return (
                <Link
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  onClick={close}
                  onMouseEnter={() => setActiveSlug(c.slug)}
                  onFocus={() => setActiveSlug(c.slug)}
                  className={cn('flex items-center gap-3 rounded-2xl px-3 py-2.5 transition', isActive ? 'bg-surface-muted' : 'hover:bg-surface-muted/60')}
                >
                  <span className={cn('grid size-10 place-items-center rounded-xl text-foreground/80', tintBg[c.tint])}>
                    <Icon size={20} />
                  </span>
                  <span className="flex-1 leading-tight">
                    <b className="block text-sm">{c.name}</b>
                    <span className="text-xs text-muted-foreground">{formatCount(c.count)} items</span>
                  </span>
                  <LuChevronRight size={16} className={cn('text-muted-foreground transition', isActive ? 'translate-x-0.5 opacity-100' : 'opacity-0')} />
                </Link>
              );
            })}
          </div>

          {/* Right: preview of the active category */}
          <div className="grid content-start gap-5 p-6">
            <div className="flex items-center gap-5">
              <CategoryImage category={active} className="size-28 shrink-0 rounded-2xl" />
              <div className="grid gap-2">
                <span className="text-xs font-extrabold uppercase tracking-[0.08em] text-link">Category</span>
                <h3 className="text-2xl font-bold tracking-tight">{active.name}</h3>
                <p className="text-sm text-muted-foreground">{formatCount(active.count)} products · delivered in 2 hours</p>
                <div className="flex gap-2">
                  <Button to={`/category/${active.slug}`} size="sm" onClick={close}>Shop {active.name}</Button>
                  <Button to={`/deals?category=${active.slug}`} size="sm" variant="secondary" onClick={close}>See deals</Button>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">Top picks</p>
              <div className="grid grid-cols-3 gap-3">
                {picks.map((p) => (
                  <Link key={p.id} to={`/product/${p.slug}`} onClick={close} className="group grid gap-2 rounded-2xl border border-border p-2.5 transition hover:border-border-strong hover:shadow-card">
                    <ProductImage product={p} className="h-24 rounded-xl" />
                    <b className="truncate text-sm group-hover:text-link">{p.name}</b>
                    <span className="text-xs text-muted-foreground">{p.unit} · <b className="text-foreground tabular-nums">{formatPrice(p.price)}</b></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[13px] font-semibold">
              {['Best sellers', 'New arrivals', 'On sale', 'Delivery today'].map((q) => (
                <Link key={q} to={`/category/${active.slug}?filter=${encodeURIComponent(q)}`} onClick={close} className="rounded-full border border-border px-3.5 py-1.5 transition hover:border-border-strong hover:bg-surface-muted">
                  {q}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer bar */}
          <div className="col-span-2 flex items-center justify-between border-t border-border bg-surface-muted px-6 py-3 text-sm">
            <span className="text-muted-foreground">86 categories · 70,000+ products</span>
            <Link to="/categories" onClick={close} className="flex items-center gap-1.5 font-bold text-link hover:underline">
              Browse all categories <LuArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu
