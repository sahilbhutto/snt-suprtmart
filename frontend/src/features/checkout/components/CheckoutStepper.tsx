import type { IconType } from "react-icons";
import { LuCheck, LuLock } from "react-icons/lu";
import { cn } from "../../../lib/cn";
import type { StepId, StepStatus } from "../types/checkout.types";

export interface StepperItem {
  id: StepId;
  label: string;
  icon: IconType;
  status: StepStatus;
}

const statusText: Record<StepStatus, string> = {
  complete: "Completed",
  active: "In progress",
  locked: "Locked",
};

const CheckoutStepper = ({ steps }: { steps: StepperItem[] }) => {
  const current = steps.findIndex((s) => s.status === "active");

  return (
    <nav aria-label="Checkout progress" className="rounded-3xl border border-border bg-surface px-5 py-5 shadow-card sm:px-8 sm:py-6">
      <ol className="flex items-center">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <li key={s.id} aria-current={s.status === "active" ? "step" : undefined} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <div className="flex items-center gap-3.5">
                <span
                  className={cn(
                    "grid size-11 shrink-0 aspect-square place-items-center rounded-full transition-all sm:size-[52px]",
                    s.status === "complete" && "bg-success text-background",
                    s.status === "active" && "bg-ink text-accent ring-[6px] ring-primary/20",
                    s.status === "locked" && "bg-surface-muted text-subtle-foreground",
                  )}
                >
                  {s.status === "complete" ? <LuCheck size={24} /> : s.status === "locked" ? <LuLock size={20} /> : <Icon size={22} />}
                </span>
                <span className="hidden gap-0.5 leading-tight sm:grid">
                  <b className={cn("text-[15px]", s.status === "locked" && "text-subtle-foreground")}>{s.label}</b>
                  <span
                    className={cn(
                      "text-xs",
                      s.status === "complete" && "font-bold text-success",
                      s.status === "active" && "font-extrabold text-link",
                      s.status === "locked" && "text-subtle-foreground",
                    )}
                  >
                    {statusText[s.status]}
                  </span>
                </span>
              </div>

              {i < steps.length - 1 && (
                <span aria-hidden className={cn("mx-3 h-1 flex-1 rounded-full transition-colors duration-500 sm:mx-5", s.status === "complete" ? "bg-success" : "bg-border")} />
              )}
            </li>
          );
        })}
      </ol>

      {current >= 0 && (
        <p className="mt-4 text-sm font-bold sm:hidden">
          Step {current + 1} of {steps.length} <span className="font-medium text-muted-foreground">· {steps[current].label}</span>
        </p>
      )}
    </nav>
  );
};

export default CheckoutStepper;
