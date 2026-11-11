import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuChevronLeft,
  LuChevronRight,
  LuZap,
} from "react-icons/lu";
import ProductCard from "../../../components/product/ProductCard";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import { flashDeals } from "../../../data/home.data";
import { cn } from "../../../lib/cn";
import useCountdown from "../../../hooks/useCountdown";

// Replace with the real end time from your API later (seconds left)
const FLASH_SECONDS_LEFT = 5 * 3600 + 42 * 60 + 10;

/** One slide: about 72% wide on phones, so the next card peeks in */
const slideSize =
  "snap-start shrink-0 basis-[72%] min-[480px]:basis-[46%] md:basis-[31%] lg:basis-[23.5%] xl:basis-[19%]";

const TimeBox = ({ value, label }: { value: string; label: string }) => (
  <div className="grid min-w-12 place-items-center rounded-xl bg-surface px-2 py-1.5 text-foreground shadow-card sm:min-w-14 sm:py-2">
    <b className="text-lg font-extrabold leading-none tabular-nums sm:text-2xl">
      {value}
    </b>
    <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  </div>
);

const Colon = () => (
  <span aria-hidden className="pb-3 text-lg font-bold text-accent sm:text-2xl">
    :
  </span>
);

const FlashDealsSection = () => {
  const { hours, minutes, seconds } = useCountdown(FLASH_SECONDS_LEFT);
  const scroller = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const x = Math.abs(el.scrollLeft); // negative in RTL
    setEdge({ start: x < 8, end: x > max - 8 });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({
      left: direction * (rtl ? -1 : 1) * el.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  const arrowClass =
    "hidden size-11 shrink-0 aspect-square place-items-center rounded-full border border-white/20 bg-white/10 text-flash-foreground transition hover:bg-white/20 disabled:pointer-events-none disabled:opacity-40 md:grid";

  return (
    <section aria-labelledby="flash-deals-title">
      <Container className="py-6 sm:py-10">
        <div className="relative overflow-hidden rounded-3xl border border-flash-border bg-flash p-4 text-flash-foreground sm:p-6 lg:p-8">
          {/* Soft glows */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-white/10 blur-3xl"
          />

          {/* Header */}
          <div className="relative mb-5 flex flex-col gap-4 sm:mb-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="grid size-12 shrink-0 aspect-square place-items-center rounded-2xl bg-accent text-accent-foreground shadow-glow sm:size-14">
                <LuZap size={26} />
              </span>
              <div className="leading-tight">
                <h2
                  id="flash-deals-title"
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                >
                  Flash deals
                </h2>
                <p className="mt-1 text-sm text-flash-muted">
                  Prices go back up when the timer ends
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Countdown */}
              <div
                className="flex items-center gap-1.5"
                role="timer"
                aria-label="Time left in this sale"
              >
                <span className="me-1 hidden text-xs font-bold uppercase tracking-wider text-deal sm:inline">
                  Ends in
                </span>
                <span className="me-1 hidden text-xs font-bold uppercase tracking-wider text-accent sm:inline" />

                <span
                  className="hidden h-8 w-px bg-white/15 lg:block"
                  aria-hidden
                />

                <TimeBox value={hours} label="hrs" />
                <Colon />
                <TimeBox value={minutes} label="min" />
                <Colon />
                <TimeBox value={seconds} label="sec" />
              </div>

              <span
                className="hidden h-8 w-px bg-border lg:block"
                aria-hidden
              />

              <Button to="/deals" variant="accent" size="sm">
                View all <LuArrowRight size={14} className="rtl:rotate-180" />
              </Button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  disabled={edge.start}
                  aria-label="Previous deals"
                  className={arrowClass}
                >
                  <LuChevronLeft className="rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  disabled={edge.end}
                  aria-label="Next deals"
                  className={arrowClass}
                >
                  <LuChevronRight className="rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrolling cards: edge to edge inside the panel */}
          <ul
            ref={scroller}
            onScroll={updateEdges}
            className="relative -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
          >
            {/* Lead card */}
            <li className={slideSize}>
              <Link
                to="/deals"
                className="group flex h-full min-h-72 flex-col justify-between rounded-xl bg-accent p-5 text-accent-foreground shadow-glow transition hover:brightness-105"
              >
                <span className="w-max rounded-full bg-black/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  Flash sale
                </span>

                <div>
                  <b className="block text-7xl font-extrabold leading-none tracking-tighter">
                    30%
                  </b>
                  <span className="mt-2 block text-base font-semibold">
                    off selected items
                  </span>
                  <span className="text-sm opacity-80">While stock lasts</span>
                </div>
                <span className="flex items-center gap-2 text-sm font-bold">
                  Shop all deals
                  <LuArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  />
                </span>
              </Link>
            </li>

            {flashDeals.map((product) => (
              <li key={product.id} className={cn(slideSize, "flex")}>
                <div className="w-full">
                  <ProductCard product={product} showProgress />
                </div>
              </li>
            ))}
          </ul>

          {/* Swipe hint, phones only */}
          <p className="relative mt-2 flex items-center justify-center gap-1 text-xs text-flash-muted md:hidden"></p>
        </div>
      </Container>
    </section>
  );
};

export default FlashDealsSection;
