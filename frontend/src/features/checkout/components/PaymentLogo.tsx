import { LuBanknote } from "react-icons/lu";
import { cn } from "../../../lib/cn";
import type { PaymentMethodId } from "../types/checkout.types";

/**
 * STAND-IN logos built from brand colours (the same in light and dark mode).
 * Before launch, replace each one with the official SVG from the brand's guidelines.
 */
const base = "inline-flex shrink-0 items-center justify-center rounded-xl";

export const MastercardMark = ({ className }: { className?: string }) => (
  <span aria-label="Mastercard" className={cn(base, "h-11 w-16 border border-[#dfe5e0] bg-white", className)}>
    <span className="size-[18px] rounded-full bg-[#EB001B]" />
    <span className="-ms-2 size-[18px] rounded-full bg-[#F79E1B] opacity-90" />
  </span>
);

export const VisaMark = ({ className }: { className?: string }) => (
  <span aria-label="Visa" className={cn(base, "h-11 w-16 border border-[#dfe5e0] bg-white text-sm font-black italic leading-none text-[#1A1F71]", className)}>
    VISA
  </span>
);

const PaymentLogo = ({ method, className }: { method: PaymentMethodId; className?: string }) => {
  switch (method) {
    case "jazzcash":
      return (
        <span aria-label="JazzCash" className={cn(base, "h-11 w-16 bg-[#ED1C24] text-xs font-extrabold leading-none text-[#FFD400]", className)}>
          Jazz<span className="text-white">Cash</span>
        </span>
      );
    case "easypaisa":
      return (
        <span aria-label="Easypaisa" className={cn(base, "h-11 w-16 bg-[#3BB44A] text-[11px] font-extrabold leading-none text-white", className)}>
          easypaisa
        </span>
      );
    case "card":
      return <MastercardMark className={className} />;
    default:
      return (
        <span aria-label="Cash on delivery" className={cn(base, "h-11 w-16 bg-success-soft text-success", className)}>
          <LuBanknote size={24} />
        </span>
      );
  }
};

export default PaymentLogo;
