import { useState } from "react";
import { LuChevronDown, LuShoppingBag } from "react-icons/lu";
import { cn } from "../../../lib/cn";
import { formatPrice } from "../../../lib/format";
import type { CartView } from "../../cart/hooks/useCartView";
import CheckoutSummary from "./CheckoutSummary";

const CheckoutMobileSummary = ({ view }: { view: CartView }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-card lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-summary"
        className="flex w-full items-center gap-3 p-4 text-start"
      >
        <LuShoppingBag size={18} className="text-link" />
        <span className="flex-1 text-sm font-bold">{open ? "Hide order summary" : "Show order summary"}</span>
        <b className="tabular-nums">{formatPrice(view.summary.total)}</b>
        <LuChevronDown size={18} className={cn("text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id="mobile-summary" className="border-t border-border p-4">
          <CheckoutSummary view={view} />
        </div>
      )}
    </div>
  );
};

export default CheckoutMobileSummary;
