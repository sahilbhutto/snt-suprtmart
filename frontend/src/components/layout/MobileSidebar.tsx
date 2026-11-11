import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  LuArrowUpRight,
  LuChevronRight,
  LuHeart,
  LuLeaf,
  LuLifeBuoy,
  LuMapPin,
  LuMessageCircle,
  LuPackageSearch,
  LuPhone,
  LuReceipt,
  LuUser,
  LuX,
  LuZap,
} from "react-icons/lu";
import Button from "../ui/Button";
import { categories } from "../../data/home.data";
import { cn } from "../../lib/cn";
import { formatCount, tintBg } from "../../lib/format";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const quickActions = [
  { label: "My orders", to: "/account/orders", icon: LuReceipt },
  { label: "Wishlist", to: "/account/wishlist", icon: LuHeart },
  { label: "Track order", to: "/track", icon: LuPackageSearch },
  { label: "Help centre", to: "/help", icon: LuLifeBuoy },
];

const infoLinks = [
  { label: "Delivery areas", to: "/help#delivery" },
  { label: "FAQ", to: "/help" },
  { label: "Terms of service", to: "/legal/terms" },
  { label: "Privacy policy", to: "/legal/privacy" },
];

type Lang = "en" | "ur";

const MobileSidebar = ({ open, onClose }: MobileSidebarProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const startX = useRef<number | null>(null);
  const [lang, setLang] = useState<Lang>(() =>
    document.documentElement.lang === "ur" ? "ur" : "en",
  );

  // Lock page scroll, close on Escape, focus the close button
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const changeLang = (next: Lang) => {
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ur" ? "rtl" : "ltr";
    setLang(next);
  };

  // Swipe toward the edge to close
  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (startX.current === null) return;
    const delta = e.changedTouches[0].clientX - startX.current;
    const closing = document.documentElement.dir === "rtl" ? delta > 70 : delta < -70;
    if (closing) onClose();
    startX.current = null;
  };

  /** Staggered entrance: each block fades and slides in after the previous one */
  const reveal = (index: number, extra = "") => ({
    style: { transitionDelay: open ? `${90 + index * 45}ms` : "0ms" },
    className: cn(
      "transition-all duration-300",
      open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 rtl:translate-x-4",
      extra,
    ),
  });

  return createPortal(
    <div
      className={cn("fixed inset-0 z-[70] transition-[visibility] duration-300 lg:hidden", open ? "visible" : "invisible")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close menu"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          "absolute inset-y-0 start-0 flex w-[min(88vw,380px)] flex-col overflow-hidden bg-background shadow-pop transition-transform duration-300 ease-out rounded-e-3xl",
          open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full",
        )}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-accent">
              <LuLeaf size={22} />
            </span>
            <b className="text-lg tracking-tight">
              SNT <span className="text-link">Supermart</span>
            </b>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-surface transition hover:bg-surface-muted"
          >
            <LuX size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Account card */}
          <div {...reveal(0, "grid gap-4 rounded-3xl bg-ink p-5 text-ink-foreground ring-1 ring-ink-border")}>
            <div className="flex items-center gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 text-accent">
                <LuUser size={22} />
              </span>
              <div className="leading-tight">
                <b className="block text-base">Welcome to SNT</b>
                <span className="text-xs text-ink-muted">Sign in to track orders and checkout faster</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button to="/login" variant="accent" size="sm" onClick={onClose}>
                Sign in
              </Button>
              <Button to="/register" variant="outlineLight" size="sm" onClick={onClose}>
                Create account
              </Button>
            </div>
          </div>

          {/* Delivery area */}
          <button
            type="button"
            {...reveal(1, "flex w-full items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 text-start")}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tint-1 text-foreground/80">
              <LuMapPin size={18} />
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-[11px] text-muted-foreground">Deliver to</span>
              <b className="text-sm">Select your area</b>
            </span>
            <LuChevronRight size={18} className="text-muted-foreground rtl:rotate-180" />
          </button>

          {/* Quick actions */}
          <div {...reveal(2, "grid grid-cols-2 gap-3")}>
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.to}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 transition active:scale-[0.98]"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-link">
                    <Icon size={18} />
                  </span>
                  <b className="text-[13px] leading-tight">{a.label}</b>
                </Link>
              );
            })}
          </div>

          {/* Deals banner */}
          <Link
            to="/deals"
            onClick={onClose}
            {...reveal(3, "flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-glow")}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
              <LuZap size={20} />
            </span>
            <span className="flex-1 leading-tight">
              <b className="block text-base">Flash deals</b>
              <span className="text-xs opacity-80">Up to 30% off today</span>
            </span>
            <LuArrowUpRight size={20} />
          </Link>

          {/* Categories */}
          <section {...reveal(4, "grid gap-3")}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Shop by category</h3>
              <Link to="/categories" onClick={onClose} className="text-xs font-bold text-link">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {categories.slice(0, 8).map((c) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.slug}
                    to={`/category/${c.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-2.5 transition active:scale-[0.98]"
                  >
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl text-foreground/80", tintBg[c.tint])}>
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 leading-tight">
                      <b className="block truncate text-[13px]">{c.name}</b>
                      <span className="text-[11px] text-muted-foreground">{formatCount(c.count)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Info links */}
          <nav aria-label="More" {...reveal(5, "overflow-hidden rounded-2xl border border-border bg-surface")}>
            {infoLinks.map((l, i) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 text-sm transition hover:bg-surface-muted",
                  i > 0 && "border-t border-border",
                )}
              >
                {l.label}
                <LuChevronRight size={16} className="text-muted-foreground rtl:rotate-180" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Sticky footer */}
        <div className="grid gap-3 border-t border-border bg-surface px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <div className="flex items-center justify-between gap-3">
            <div role="group" aria-label="Language" className="flex rounded-full bg-surface-muted p-1 text-xs font-bold">
              {(["en", "ur"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => changeLang(l)}
                  aria-pressed={lang === l}
                  className={cn(
                    "rounded-full px-4 py-1.5 transition",
                    lang === l ? "bg-ink text-ink-foreground" : "text-muted-foreground",
                  )}
                >
                  {l === "en" ? "English" : "اردو"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <a
                href="https://wa.me/92XXXXXXXXXX"
                aria-label="WhatsApp"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-surface"
              >
                <LuMessageCircle size={18} />
              </a>
              <a
                href="tel:+92XXXXXXXXXX"
                aria-label="Call us"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-surface"
              >
                <LuPhone size={18} />
              </a>
            </div>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">
            Cash on delivery · Easypaisa · JazzCash · Cards
          </p>
        </div>
      </aside>
    </div>,
    document.body,
  );
};

export default MobileSidebar;
