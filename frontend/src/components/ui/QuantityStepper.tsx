import { LuMinus, LuPlus } from 'react-icons/lu';

interface QuantityStepperProps {
  value: number;
  label: string; 
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

const QuantityStepper = ({ value, label, onIncrease, onDecrease, min, max }: QuantityStepperProps) => (
  <div className="flex items-center gap-1 rounded-full border border-border bg-surface-muted p-0.5">
    <button
      disabled={min !== undefined && value <= min}
      type="button"
      onClick={onDecrease}
      aria-label={`Decrease ${label}`}
      className="grid size-8 place-items-center rounded-full bg-surface transition hover:bg-background"
    >
      <LuMinus size={14} />
    </button>
    <b className="w-6 text-center text-sm tabular-nums" aria-live="polite">{value}</b>
    <button
      disabled={max !== undefined && value >= max}
      type="button"
      onClick={onIncrease}
      aria-label={`Increase ${label}`}
      className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition hover:brightness-110"
    >
      <LuPlus size={14} />
    </button>


  </div>
);

export default QuantityStepper;
