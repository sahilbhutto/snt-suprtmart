import { LuTruck } from 'react-icons/lu';
import type { CartSummary } from '../../lib/cart';
import { formatPrice } from '../../lib/format';

const FreeDeliveryProgress = ({ summary }: { summary: Pick<CartSummary, 'remainingForFree' | 'freeProgress'> }) => {
  const unlocked = summary.remainingForFree === 0;

  return (
    <div className="grid gap-2.5 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-tint-1 text-foreground/80">
          <LuTruck size={18} />
        </span>
        <p className="text-sm leading-snug">
          {unlocked ? (
            <b>You unlocked free delivery</b>
          ) : (
            <>
              Add <b>{formatPrice(summary.remainingForFree)}</b> more for <b>free delivery</b>
            </>
          )}
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={Math.round(summary.freeProgress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${summary.freeProgress}%` }} />
      </div>
    </div>
  );
};

export default FreeDeliveryProgress;
