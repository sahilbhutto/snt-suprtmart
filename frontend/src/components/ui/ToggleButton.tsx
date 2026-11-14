import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface ToggleButtonProps {
  pressed: boolean;
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
}

const ToggleButton = ({ pressed, onClick, icon, children }: ToggleButtonProps) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(
      "flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-bold shadow-card transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex-none",
      pressed ? "border-ink bg-ink text-ink-foreground" : "border-border bg-surface hover:border-border-strong",
    )}
  >
    {icon}
    {children}
  </button>
);

export default ToggleButton;
