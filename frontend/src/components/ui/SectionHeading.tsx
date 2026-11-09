import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

const SectionHeading = ({
  eyebrow,
  title,
  actionLabel,
  actionTo,
  inverted,
}: {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  actionTo?: string;
  inverted?: boolean;
}) => (
  <div className="mb-5 flex items-end justify-between gap-4">
    <div className="grid gap-1.5">
      {eyebrow && <span className={cn('text-xs font-extrabold uppercase tracking-[0.08em]', inverted ? 'text-accent' : 'text-link')}>{eyebrow}</span>}
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
    </div>
    {actionLabel && actionTo && (
      <Link to={actionTo} className={cn('shrink-0 text-sm font-bold hover:underline', inverted ? 'text-accent' : 'text-link')}>
        {actionLabel}
      </Link>
    )}
  </div>
);


export default SectionHeading
