import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { cn } from "../../lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

type PageItem = number | "gap-start" | "gap-end";

const getPages = (page: number, total: number): PageItem[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: PageItem[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) pages.push("gap-start");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("gap-end");
  pages.push(total);
  return pages;
};

const edgeButton =
  "flex h-11 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-bold transition hover:border-border-strong hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-40";

const Pagination = ({ page, totalPages, onChange, className }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-2", className)}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page" className={edgeButton}>
        <LuChevronLeft className="rtl:rotate-180" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Phones: compact label */}
      <span className="min-w-28 text-center text-sm font-semibold tabular-nums sm:hidden" aria-live="polite">
        Page {page} of {totalPages}
      </span>

      {/* Tablet and up: numbers */}
      <ul className="hidden items-center gap-1.5 sm:flex">
        {getPages(page, totalPages).map((p) =>
          typeof p === "string" ? (
            <li key={p} aria-hidden className="grid size-11 place-items-center text-muted-foreground">…</li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "grid size-11 shrink-0 aspect-square place-items-center rounded-full text-sm font-bold tabular-nums transition",
                  p === page
                    ? "bg-ink text-ink-foreground shadow-pop"
                    : "border border-border bg-surface hover:border-border-strong hover:bg-surface-muted",
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>

      <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page" className={edgeButton}>
        <span className="hidden sm:inline">Next</span>
        <LuChevronRight className="rtl:rotate-180" />
      </button>
    </nav>
  );
};

export default Pagination;
