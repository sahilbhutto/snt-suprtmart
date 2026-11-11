import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuArrowUpRight, LuTruck } from "react-icons/lu";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import { aisles } from "../../../data/aisles.data";
import { cn } from "../../../lib/cn";
import { formatCount, formatPrice, tintBg } from "../../../lib/format";
import type { Aisle, AisleLink, Tint } from "../../../types/catalog";

/** Small photo that hides itself if the file is missing */
const AisleThumb = ({ src, alt }: { src?: string; alt: string }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      width={160}
      height={160}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="size-20 shrink-0 rounded-2xl object-cover shadow-card ring-2 ring-surface sm:size-24"
    />
  );
};

/** Trend or New badge on a subcategory tile */
const LinkBadge = ({ link }: { link: AisleLink }) => {
  if (link.isNew) {
    return <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">New</span>;
  }
  if (link.trend) {
    return <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success">+{link.trend}%</span>;
  }
  return null;
};

const AislesSection = () => {
  const [activeId, setActiveId] = useState(aisles[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const active: Aisle = aisles.find((a) => a.id === activeId) ?? aisles[0];
  const ActiveIcon = active.icon;

  /* Arrow keys move between tabs */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = aisles.findIndex((a) => a.id === activeId);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % aisles.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + aisles.length) % aisles.length;
    else return;
    e.preventDefault();
    setActiveId(aisles[next].id);
    tabRefs.current[aisles[next].id]?.focus();
  };

  return (
    <section aria-labelledby="aisles-title">
      <Container className="py-6 sm:py-10">
        <SectionHeading
          eyebrow="Browse"
          title="Browse every aisle"
          actionLabel="All 86 categories"
          actionTo="/categories"
        />
        <h2 id="aisles-title" className="sr-only">Browse every aisle</h2>

        {/* Tabs: scroll sideways on phones, one row on desktop */}
        <div
          role="tablist"
          aria-label="Store aisles"
          onKeyDown={handleKeyDown}
          className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {aisles.map((a) => {
            const Icon = a.icon;
            const selected = a.id === active.id;
            return (
              <button
                key={a.id}
                ref={(el) => {
                  tabRefs.current[a.id] = el;
                }}
                type="button"
                role="tab"
                id={`aisle-tab-${a.id}`}
                aria-selected={selected}
                aria-controls="aisle-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(a.id)}
                className={cn(
                  "flex min-w-44 shrink-0 snap-start items-center gap-3 rounded-2xl border px-4 py-3 text-start transition duration-200 lg:min-w-0",
                  selected
                    ? "border-ink bg-ink text-ink-foreground shadow-pop"
                    : "border-border bg-surface hover:border-border-strong",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 aspect-square place-items-center rounded-xl",
                    selected ? "bg-accent text-accent-foreground" : cn(tintBg[a.tint], "text-foreground/80"),
                  )}
                >
                  <Icon size={20} />
                </span>
                <span className="min-w-0 leading-tight">
                  <b className="block truncate text-sm">{a.title}</b>
                  <span className={cn("text-xs", selected ? "text-ink-muted" : "text-muted-foreground")}>
                    {formatCount(a.productCount)} items
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          key={active.id}
          id="aisle-panel"
          role="tabpanel"
          aria-labelledby={`aisle-tab-${active.id}`}
          className="mt-4 grid animate-fade-in gap-4 lg:grid-cols-[minmax(0,340px)_1fr]"
        >
          {/* Feature card */}
          <article className={cn("relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl p-5 text-foreground sm:p-7", tintBg[active.tint])}>
            <ActiveIcon
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -end-6 size-52 opacity-[0.1]"
            />

            <div className="relative flex items-start justify-between gap-4">
              <div className="grid gap-2">
                <span className="w-max rounded-full bg-surface px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  Aisle
                </span>
                <h3 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{active.title}</h3>
              </div>
              <AisleThumb src={active.image} alt={`${active.title} aisle`} />
            </div>

            <div className="relative grid gap-4">
              <p className="max-w-xs text-sm text-muted-foreground">{active.tagline}</p>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-surface px-3 py-1.5">{formatCount(active.productCount)} products</span>
                <span className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5">
                  <LuTruck size={13} /> 2-hour delivery
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">Top brands:</span>
                {active.brands.map((b) => (
                  <Link
                    key={b}
                    to={`/products?brand=${encodeURIComponent(b)}`}
                    className="rounded-full border border-border bg-surface px-3 py-1 font-semibold transition hover:border-border-strong"
                  >
                    {b}
                  </Link>
                ))}
              </div>

              <Button to={`/category/${active.slug}`} variant="ink" className="w-full sm:w-max">
                Shop {active.title} <LuArrowRight size={16} className="rtl:rotate-180" />
              </Button>
            </div>
          </article>

          {/* Subcategory tiles */}
          <ul className="grid grid-cols-2 content-start gap-3 sm:grid-cols-3">
            {active.links.map((link, i) => {
              const Icon = active.icon;
              return (
                <li key={link.slug}>
                  <Link
                    to={`/category/${link.slug}`}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-pop"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "grid size-12 shrink-0 aspect-square place-items-center rounded-2xl text-foreground/80",
                          tintBg[(((active.tint + i - 1) % 6) + 1) as Tint],
                        )}  
                      >
                        <Icon size={22} />
                      </span>
                      <LinkBadge link={link} />
                    </div>

                    <div className="leading-tight">
                      <b className="block text-sm sm:text-base">{link.label}</b>
                      <span className="text-xs text-muted-foreground">{formatCount(link.count)} items</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        From <b className="text-foreground tabular-nums">{formatPrice(link.fromPrice)}</b>
                      </span>
                      <LuArrowUpRight
                        size={16}
                        className="text-muted-foreground transition group-hover:text-link rtl:-scale-x-100"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}

            {/* See-all strip */}
            <li className="col-span-2 sm:col-span-3">
              <Link
                to={`/category/${active.slug}`}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-ink px-5 py-4 text-ink-foreground ring-1 ring-ink-border transition hover:brightness-125"
              >
                <span className="leading-tight">
                  <b className="block text-sm sm:text-base">See all {formatCount(active.productCount)} items in {active.title}</b>
                  <span className="text-xs text-ink-muted">Filter by brand, price and rating</span>
                </span>
                <span className="grid size-10 shrink-0 aspect-square place-items-center rounded-full bg-accent text-accent-foreground transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
                  <LuArrowRight size={18} className="rtl:rotate-180" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default AislesSection;
