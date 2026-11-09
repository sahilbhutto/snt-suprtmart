import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

const Card = ({ children, className, hover }: { children: ReactNode; className?: string; hover?: boolean }) => (
  <div
    className={cn(
      'rounded-xl border border-border bg-surface shadow-card',
      hover && 'transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-pop',
      className,
    )}
  >
    {children}
  </div>
);

export default Card
