import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuArrowLeft, LuArrowRight, LuCheck, LuLock, LuPencil } from "react-icons/lu";
import Button from "../../../components/ui/Button";
import { cn } from "../../../lib/cn";
import type { StepStatus } from "../types/checkout.types";

interface CheckoutStepProps {
  id: string;
  number: number;
  total: number;
  title: string;
  description: string;
  icon: IconType;
  status: StepStatus;
  /** One line shown once the step is complete */
  summary?: ReactNode;
  onEdit: () => void;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  children?: ReactNode;
}

const CheckoutStep = ({
  id,
  number,
  total,
  title,
  description,
  icon: Icon,
  status,
  summary,
  onEdit,
  onBack,
  onNext,
  nextLabel,
  children,
}: CheckoutStepProps) => {
  /* ---------- Complete ---------- */
  if (status === "complete") {
    return (
      <section id={`step-${id}`} aria-labelledby={`step-${id}-title`} className="scroll-mt-28 rounded-3xl border border-success/40 bg-success-soft/40">
        <div className="flex items-center gap-4 p-5 sm:px-6">
          <span className="grid size-11 shrink-0 aspect-square place-items-center rounded-full bg-success text-background">
            <LuCheck size={22} />
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <h2 id={`step-${id}-title`} className="text-base font-bold">{title}</h2>
            {summary && <p className="mt-1 truncate text-sm text-muted-foreground">{summary}</p>}
          </div>
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2.5 text-xs font-bold transition hover:border-border-strong"
          >
            <LuPencil size={14} /> Edit
          </button>
        </div>
      </section>
    );
  }

  /* ---------- Locked ---------- */
  if (status === "locked") {
    return (
      <section id={`step-${id}`} aria-labelledby={`step-${id}-title`} className="scroll-mt-28 rounded-3xl border-[1.5px] border-dashed border-border-strong bg-surface-muted/40">
        <div className="flex items-center gap-4 p-5 sm:px-6">
          <span className="grid size-11 shrink-0 aspect-square place-items-center rounded-full bg-surface-muted text-subtle-foreground">
            <LuLock size={18} />
          </span>
          <div className="leading-tight">
            <h2 id={`step-${id}-title`} className="text-base font-bold text-subtle-foreground">{title}</h2>
            <p className="mt-1 text-sm text-subtle-foreground">Finish the step above to unlock</p>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Active ---------- */
  return (
    <section id={`step-${id}`} aria-labelledby={`step-${id}-title`} className="scroll-mt-28 rounded-[1.75rem] border-2 border-primary bg-surface shadow-pop">
      <header className="flex items-center gap-4 border-b border-border p-5 sm:px-7 sm:py-6">
        <span className="grid size-12 shrink-0 aspect-square place-items-center rounded-full bg-ink text-accent">
          <Icon size={22} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <h2 id={`step-${id}-title`} className="text-xl font-bold sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <span className="hidden shrink-0 rounded-full bg-primary-soft px-3.5 py-1.5 text-xs font-bold text-link sm:inline">
          Step {number} of {total}
        </span>
      </header>

      <div className="animate-slide-up p-5 sm:p-7">{children}</div>

      <footer className="flex flex-col-reverse gap-3 rounded-b-[1.6rem] border-t border-border bg-surface-muted/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        {onBack ? (
          <Button type="button" variant="secondary" size="lg" onClick={onBack}>
            <LuArrowLeft size={16} className="rtl:rotate-180" /> Back
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground">Your details are encrypted and never shared.</p>
        )}
        <Button type="button" size="lg" onClick={onNext}>
          {nextLabel} <LuArrowRight size={16} className="rtl:rotate-180" />
        </Button>
      </footer>
    </section>
  );
};

export default CheckoutStep;
