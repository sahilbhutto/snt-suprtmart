import { useState } from "react";
import type { FormEvent, KeyboardEvent, MouseEvent, TouchEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuArrowRight,
  LuChevronLeft,
  LuChevronRight,
  LuMapPin,
  LuSearch,
  LuStar,
  LuTruck,
} from "react-icons/lu";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { cn } from "../../../lib/cn";
import { heroSlides } from "../../../data/home.data";


const popularSearches = ["Basmati rice", "Fresh milk", "Cooking oil", "Eggs", "Tea"];

const stats = [
  { value: "70,000+", label: "products" },
  { value: "2 hrs", label: "avg. delivery" },
  { value: "14", label: "zones" },
];

const avatarInitials = ["AK", "BA", "SM", "HR"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = heroSlides.length;
  const slide = heroSlides[index];

  const go = (i: number) => setIndex((i + total) % total);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  /* Cards drift slightly with the mouse (desktop only, no re-render) */
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    e.currentTarget.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
    setPaused(false);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta < -50) next();
    if (delta > 50) prev();
    setTouchStartX(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  const drift = (strength: number) => ({
    transform: `translate3d(calc(var(--px, 0) * ${strength}px), calc(var(--py, 0) * ${strength}px), 0)`,
    transition: "transform 250ms ease-out",
  });

  return (
    <section aria-label="Welcome to SNT Supermart">
      <Container className="pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-ink text-ink-foreground ring-1 ring-ink-border sm:rounded-3xl">
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-accent/15 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 size-96 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative grid gap-8 p-4 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-12">
            {/* ================= LEFT: message ================= */}
            <div className="flex flex-col justify-center gap-6">
              <Badge tone="glass" className="w-max gap-2 py-1.5 text-xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                Now delivering in 14 zones
              </Badge>

              <h1 className="text-[2.3rem] font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
                Fresh groceries at your door in{" "}
                <span className="relative whitespace-nowrap text-accent">
                  2 hours
                  <svg aria-hidden viewBox="0 0 200 9" fill="none" className="absolute -bottom-1.5 left-0 w-full text-accent">
                    <path d="M2 6.5C50 2 120 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="max-w-lg text-base text-ink-muted sm:text-lg">
                Shop 70,000+ products from your own town&apos;s supermarket. Pay cash on delivery or online with Easypaisa and JazzCash.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} role="search" className="flex w-[84%] sm:w-full max-w-xl items-center gap-1 rounded-full bg-white p-1.5 shadow-pop">
                <LuSearch className="ms-3 shrink-0 text-neutral-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search products"
                  placeholder="Search rice, milk, oil, eggs..."
                  className="h-11 min-w-0 flex-1 bg-transparent px-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-500"
                />
                <Button type="submit" variant="ink" aria-label="Search">
                  <span className="hidden sm:inline">Search</span>
                  <LuArrowRight className="sm:hidden" />
                </Button>
              </form>

              <div className="-mt-2 flex items-center gap-2 overflow-x-auto text-xs [scrollbar-width:none]">
                <span className="shrink-0 text-ink-muted">Popular:</span>
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    to={`/products?q=${encodeURIComponent(term)}`}
                    className="shrink-0 rounded-full border border-ink-border px-3 py-1.5 transition hover:bg-white/10"
                  >
                    {term}
                  </Link>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-1 sm:gap-3">
                <Button to="/products" variant="accent" size="lg">
                  Start shopping <LuArrowRight />
                </Button>
                <Button to="/track" variant="outlineLight" size="lg">
                  Track an order
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {avatarInitials.map((a, i) => (
                    <span
                      key={a}
                      className={cn(
                        "grid size-9 place-items-center rounded-full text-[11px] font-bold text-foreground ring-2 ring-ink",
                        ["bg-tint-1", "bg-tint-2", "bg-tint-3", "bg-tint-4"][i],
                      )}
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <div className="leading-tight">
                  <span className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <LuStar key={i} size={14} className="fill-current" />
                    ))}
                    <b className="ms-1.5 text-sm text-ink-foreground">4.8</b>
                  </span>
                  <span className="text-xs text-ink-muted">from 12,480 happy customers</span>
                </div>
              </div>

              {/* Stats */}
              <dl className="grid grid-cols-3 gap-4 border-t border-ink-border pt-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-2xl font-extrabold tracking-tight sm:text-3xl">{s.value}</dd>
                    <span aria-hidden className="text-xs text-ink-muted">{s.label}</span>
                  </div>
                ))}
              </dl>
            </div>

            {/* ================= RIGHT: photo showcase ================= */}
            <div
              role="group"
              aria-roledescription="carousel"
              aria-label="Photos of our stores"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-5/6 overflow-hidden rounded-3xl bg-ink-border outline-none ring-1 ring-white/10 focus-visible:ring-2 focus-visible:ring-accent sm:aspect-16/11 lg:aspect-auto lg:min-h-140"
            >
              {/* Photos */}
              {heroSlides.map((s, i) => (
                <img
                  key={s.id}
                  src={s.image}
                  alt={s.alt}
                  width={900}
                  height={1000}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  aria-hidden={i !== index}
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-opacity duration-1000",
                    i === index ? "opacity-100" : "opacity-0",
                    i === index && !reduced && "animate-kenburns",
                  )}
                />
              ))}

              {/* Readability overlays */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/55 to-transparent" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-black/75 to-transparent" />

              {/* Story progress bars (click to jump) */}
              <div className="absolute inset-x-4 top-3 z-10 flex gap-1.5 sm:inset-x-6 sm:top-5">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show photo ${i + 1}: ${s.title}`}
                    aria-current={i === index}
                    className="h-6 flex-1 py-2.5"
                  >
                    <span className="block h-1 overflow-hidden rounded-full bg-white/30">
                      <span
                        className={cn(
                          "block h-full rounded-full bg-white",
                          i < index && "w-full",
                          i === index && (reduced ? "w-full" : "animate-progress"),
                        )}
                        style={i === index ? { animationPlayState: paused ? "paused" : "running" } : undefined}
                        onAnimationEnd={i === index && !reduced ? next : undefined}
                      />
                    </span>
                  </button>
                ))}
              </div>

              {/* Floating: deal chip */}
              <div className="absolute left-4 top-14 z-10 sm:left-6 sm:top-16" style={drift(10)}>
                <div className="animate-float">
                  <Link
                    to="/category/fruits-veg"
                    className="flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/15 py-2 pe-4 ps-2 text-white shadow-pop backdrop-blur-md transition hover:bg-white/25"
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-accent text-sm font-extrabold text-accent-foreground">
                      -20%
                    </span>
                    <span className="text-xs leading-tight">
                      <b className="block text-sm">Fruit box Rs. 999</b>
                      Weekend deal
                    </span>
                  </Link>
                </div>
              </div>

              {/* Floating: live order card (sample, hidden on small phones) */}
              <div className="absolute right-4 top-1/3 z-10 hidden w-56 sm:block lg:right-6" style={drift(-16)}>
                <div className="animate-float-slow rounded-2xl border border-white/20 bg-black/35 p-3.5 text-white shadow-pop backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                      <LuTruck size={18} />
                    </span>
                    <span className="text-xs leading-tight">
                      <b className="block text-sm">Order #10482</b>
                      Imran is 12 min away
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[72%] rounded-full bg-accent" />
                  </div>
                </div>
              </div>

              {/* Caption + controls */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-6">
                <div key={slide.id} className="max-w-[16rem] animate-slide-up rounded-2xl border border-white/20 bg-white/15 p-3.5 text-white backdrop-blur-md sm:max-w-xs">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-accent">
                    <LuMapPin size={12} /> {index + 1} / {total}
                  </span>
                  <b className="mt-1 block text-base leading-tight sm:text-lg">{slide.title}</b>
                  <span className="text-xs text-white/80">{slide.caption}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden gap-2 md:flex">
                    {heroSlides.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`Show ${s.title}`}
                        className={cn(
                          "size-12 shrink-0 overflow-hidden rounded-xl ring-2 transition",
                          i === index ? "ring-accent" : "opacity-70 ring-transparent hover:opacity-100",
                        )}
                      >
                        <img src={s.image} alt="" width={96} height={96} loading="lazy" className="size-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous photo"
                    className="grid size-11 shrink-0 aspect-square place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30"
                  >
                    <LuChevronLeft className="rtl:rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next photo"
                    className="grid size-11 shrink-0 aspect-square place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/30"
                  >
                    <LuChevronRight className="rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
