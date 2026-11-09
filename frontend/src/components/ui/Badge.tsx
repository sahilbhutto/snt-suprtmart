import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeTone = 'neutral' | 'deal' | 'success' | 'accent' | 'ink' | 'glass';

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-muted-foreground',
  deal: 'bg-deal-soft text-deal',
  success: 'bg-success-soft text-success',
  accent: 'bg-accent text-accent-foreground',
  ink: 'bg-ink text-ink-foreground',
  glass: 'bg-white/10 text-ink-foreground ring-1 ring-white/15',
};

const Badge = ({ tone = 'neutral', className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) => (
  <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold', badgeTones[tone], className)}>
    {children}
  </span>
);

export default Badge
