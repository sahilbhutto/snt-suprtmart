import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuArrowRight,
  LuArrowUpRight,
  LuCheck,
  LuCopy,
  LuGift,
  LuWallet,
} from "react-icons/lu";
import Button from "../../../components/ui/Button";
import Container from "../../../components/ui/Container";
import SectionHeading from "../../../components/ui/SectionHeading";
import { cn } from "../../../lib/cn";
import type { PromoTile, PromoTone } from "../../../types/catalog";
import { paymentOffer, promoTiles, referral } from "../../../data/promo.data";

/* Full class names so Tailwind can find them */
const tones: Record<
  PromoTone,
  { card: string; muted: string; badge: string; arrow: string }
> = {
  ink: {
    card: "bg-ink text-ink-foreground ring-1 ring-ink-border",
    muted: "text-ink-muted",
    badge: "bg-white/10 text-ink-foreground",
    arrow: "bg-accent text-accent-foreground",
  },
  tint2: {
    card: "bg-tint-2 text-foreground",
    muted: "text-muted-foreground",
    badge: "bg-surface text-foreground",
    arrow: "bg-ink text-ink-foreground",
  },
  tint3: {
    card: "bg-tint-3 text-foreground",
    muted: "text-muted-foreground",
    badge: "bg-surface text-foreground",
    arrow: "bg-ink text-ink-foreground",
  },
  tint4: {
    card: "bg-tint-4 text-foreground",
    muted: "text-muted-foreground",
    badge: "bg-surface text-foreground",
    arrow: "bg-ink text-ink-foreground",
  },
};

/* ---------- Big payment offer tile ---------- */

const PaymentTile = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentOffer.code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the code is still visible to copy by hand */
    }
  };

  return (
    <article className="relative flex min-h-80 flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-glow sm:p-8 md:col-span-2 lg:col-span-5 lg:row-span-2">
      {/* Decorative rings and wallet */}
      <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 size-64 rounded-full border border-current opacity-15" />
      <div aria-hidden className="pointer-events-none absolute -end-6 -top-6 size-44 rounded-full border border-current opacity-15" />
      <LuWallet aria-hidden className="pointer-events-none absolute -bottom-8 -end-6 size-52 opacity-[0.12]" />

      <div className="relative grid gap-4">
        <span className="w-max rounded-full bg-black/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
          Pay online
        </span>

        <div>
          <b className="block text-6xl font-extrabold leading-none tracking-tighter sm:text-7xl">
            {paymentOffer.amount}
            <span className="ms-2 text-3xl font-bold tracking-tight sm:text-4xl">off</span>
          </b>
          <p className="mt-3 max-w-xs text-base opacity-90 sm:text-lg">
            when you pay with {paymentOffer.methods.join(" or ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {paymentOffer.methods.map((m) => (
            <span key={m} className="rounded-full bg-surface px-3.5 py-1.5 text-xs font-bold text-foreground">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid gap-4">
        {/* Coupon box */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-current/40 bg-black/10 p-3 ps-4">
          <div className="leading-tight">
            <span className="text-[11px] uppercase tracking-wider opacity-80">Use code</span>
            <b className="block text-xl font-extrabold tracking-[0.15em]">{paymentOffer.code}</b>
          </div>
          <Button variant="ink" size="sm" onClick={copyCode} aria-live="polite">
            {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
            {copied ? "Copied" : "Copy code"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs opacity-80">On orders above {paymentOffer.minOrder}. Valid today.</span>
          <Button to="/products" variant="ink">
            Shop now <LuArrowRight size={16} className="rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </article>
  );
};

/* ---------- Link tile (data driven) ---------- */

const PromoLinkTile = ({ tile }: { tile: PromoTile }) => {
  const Icon = tile.icon;
  const tone = tones[tile.tone];

  return (
    <Link
      to={tile.to}
      className={cn(
        "group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:shadow-pop sm:p-6",
        tone.card,
        tile.area,
      )}
    >
      <Icon
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -end-4 size-36 opacity-[0.12] transition duration-500 group-hover:-rotate-6 group-hover:scale-110"
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold", tone.badge)}>
          {tile.badge}
        </span>
        <span
          className={cn(
            "grid size-10 shrink-0 aspect-square place-items-center rounded-full transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5",
            tone.arrow,
          )}
        >
          <LuArrowUpRight size={18} className="rtl:-scale-x-100" />
        </span>
      </div>

      <div className="relative mt-8">
        <h3 className="text-xl font-bold leading-tight sm:text-2xl">{tile.title}</h3>
        <p className={cn("mt-1 text-sm", tone.muted)}>{tile.text}</p>
        {tile.meta && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold">
            <span className="size-1.5 rounded-full bg-current" /> {tile.meta}
          </span>
        )}
      </div>
    </Link>
  );
};

/* ---------- Referral strip ---------- */

const ReferralStrip = () => (
  <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-accent p-5 text-accent-foreground sm:flex-row sm:items-center sm:justify-between sm:p-7 md:col-span-2 lg:col-span-12">
    <LuGift
      aria-hidden
      className="pointer-events-none absolute -end-6 -top-6 size-40 -rotate-12 opacity-[0.12]"
    />
    <div className="relative flex items-center gap-4">
      <span className="grid size-14 shrink-0 aspect-square place-items-center rounded-2xl bg-ink text-accent">
        <LuGift size={26} />
      </span>
      <div className="leading-tight">
        <b className="block text-lg font-bold sm:text-xl">{referral.title}</b>
        <span className="text-sm opacity-80">{referral.text}</span>
      </div>
    </div>
    <Button to={referral.to} variant="ink" className="relative w-full sm:w-auto">
      {referral.cta} <LuArrowRight size={16} className="rtl:rotate-180" />
    </Button>
  </div>
);

/* ---------- Section ---------- */

const PromoBentoSection = () => (
  <section aria-label="Offers and promotions">
    <Container className="py-6 sm:py-10">
      <SectionHeading
        eyebrow="Offers"
        title="Today's best offers"
        actionLabel="All offers"
        actionTo="/deals"
      />

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[repeat(2,minmax(11rem,auto))]">
        <PaymentTile />
        {promoTiles.map((tile) => (
          <PromoLinkTile key={tile.id} tile={tile} />
        ))}
        <ReferralStrip />
      </div>
    </Container>
  </section>
);

export default PromoBentoSection;
