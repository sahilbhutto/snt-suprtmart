import { LuLock } from "react-icons/lu";
import Button from "../../../components/ui/Button";
import { formatPrice } from "../../../lib/format";

interface PlaceOrderButtonProps {
  total: number;
  submitting: boolean;
  disabled?: boolean;
  className?: string;
}

const PlaceOrderButton = ({ total, submitting, disabled, className }: PlaceOrderButtonProps) => (
  <Button type="submit" size="lg" disabled={disabled || submitting} className={className}>
    {submitting ? (
      <>
        <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Placing order...
      </>
    ) : (
      <>
      <LuLock size={16} /> Confirm order · {formatPrice(total)}
      </>
    )}
  </Button>
);

export default PlaceOrderButton;
