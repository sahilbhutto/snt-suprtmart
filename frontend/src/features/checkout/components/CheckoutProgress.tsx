import { LuCheck } from "react-icons/lu";
import { cn } from "../../../lib/cn";
import type { StepStatus } from "../types/checkout.types";

export interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
}

const CheckoutProgress = ({ steps }: { steps: ProgressStep[] }) => (
  <ol className="grid gap-2 sm:gap-4" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label="Checkout progress">
    {steps.map((s, i) => (
      <li key={s.id} aria-current={s.status === "active" ? "step" : undefined} className="grid gap-2">
        <span
          className={cn(
            "h-1.5 rounded-full transition-colors duration-300",
            s.status === "complete" && "bg-success",
            s.status === "active" && "bg-primary",
            s.status === "locked" && "bg-border",
          )}
        />
        <span className="flex items-center gap-2 text-xs font-bold sm:text-sm">
          <span
            className={cn(
              "grid size-5 shrink-0 place-items-center rounded-full text-[10px]",
              s.status === "complete" && "bg-success text-background",
              s.status === "active" && "bg-ink text-ink-foreground",
              s.status === "locked" && "bg-surface-muted text-muted-foreground",
            )}
          >
            {s.status === "complete" ? <LuCheck size={12} /> : i + 1}
          </span>
          <span className={cn("truncate", s.status === "locked" ? "text-muted-foreground" : "text-foreground")}>{s.label}</span>
        </span>
      </li>
    ))}
  </ol>
);

export default CheckoutProgress;
