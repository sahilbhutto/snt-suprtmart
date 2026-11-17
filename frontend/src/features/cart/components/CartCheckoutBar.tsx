import Button from "../../../components/ui/Button";
import { formatPrice } from "../../../lib/format";
import { useIsAuthenticated } from "../../auth/store/authStore";
import type { CartSummary } from "../lib/cart";

interface CartCheckoutBarProps {
  summary: CartSummary;
  canCheckout: boolean;
}

const CartCheckoutBar = ({summary, canCheckout }: CartCheckoutBarProps) => {
  
  const isAuthed = useIsAuthenticated();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-pop backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <div className="leading-tight">
          <span className="text-xs text-muted-foreground">Total</span>
          <b className="block text-xl font-extrabold tabular-nums">
            {formatPrice(summary.total)}
          </b>
        </div>

        {canCheckout ? (
          <Button to={isAuthed ? "/checkout" : "/login"} size="lg" className="flex-1">
            {isAuthed
              ? `Proceed to checkout · ${formatPrice(summary.total)}`
              : "Sign in to checkout"}
          </Button>
        ) : (
          <Button size="lg" disabled className="flex-1">
            Fix cart to continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default CartCheckoutBar;
