import { useState } from "react";
import { LuBadgeCheck, LuStar, LuThumbsUp } from "react-icons/lu";
import type { ProductReview, ReviewSummary, StarRating } from "../../../types/review.types";
import Button from "../../../components/ui/Button";
import RatingStars from "../../../components/ui/RatingStars";
import { formatCount, formatDate } from "../../../lib/format";
import { cn } from "../../../lib/cn";


const STARS: StarRating[] = [5, 4, 3, 2, 1];

interface ProductReviewsProps {
  reviews: ProductReview[];
  summary: ReviewSummary;
}

const ProductReviews = ({ reviews, summary }: ProductReviewsProps) => {
  const [helpful, setHelpful] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<StarRating | null>(null);

  const visible = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  const toggleHelpful = (id: string) =>
    setHelpful((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (summary.count === 0) {
    return (
      <div className="grid place-items-center gap-3 py-10 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
          <LuStar size={26} />
        </span>
        <b>No reviews yet</b>
        <p className="text-sm text-muted-foreground">Be the first to share what you think.</p>
        <Button variant="secondary">Write a review</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      {/* Summary */}
      <div className="grid content-start gap-5">
        <div className="flex items-end gap-3">
          <b className="text-6xl font-extrabold leading-none tracking-tight tabular-nums">{summary.average.toFixed(1)}</b>
          <div className="grid gap-1 pb-1">
            <RatingStars value={summary.average} size={18} />
            <span className="text-xs text-muted-foreground">{formatCount(summary.count)} reviews</span>
          </div>
        </div>

        <ul className="grid gap-2">
          {STARS.map((star) => {
            const count = summary.breakdown[star];
            const percent = summary.count ? Math.round((count / summary.count) * 100) : 0;
            const active = filter === star;
            return (
              <li key={star}>
                <button
                  type="button"
                  onClick={() => setFilter(active ? null : star)}
                  aria-pressed={active}
                  className={cn("flex w-full items-center gap-3 rounded-lg px-1 py-1 text-xs transition hover:bg-surface-muted", active && "bg-surface-muted")}
                >
                  <span className="flex w-8 items-center gap-1 font-bold">{star}<LuStar size={12} className="fill-amber-500 text-amber-500" /></span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                    <span className="block h-full rounded-full bg-amber-500" style={{ width: `${percent}%` }} />
                  </span>
                  <span className="w-9 text-end tabular-nums text-muted-foreground">{percent}%</span>
                </button>
              </li>
            );
          })}
        </ul>

        <Button variant="secondary">Write a review</Button>
      </div>

      {/* List */}
      <div className="grid content-start gap-4">
        {filter && (
          <p className="text-sm text-muted-foreground">
            Showing {filter}-star reviews.{" "}
            <button type="button" onClick={() => setFilter(null)} className="font-bold text-link hover:underline">Show all</button>
          </p>
        )}

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-sm text-muted-foreground">
            No {filter ? `${filter}-star ` : ""}reviews to show yet.
          </p>
        ) : (
          <ul className="grid gap-4">
            {visible.map((r) => (
              <li key={r.id} className="grid gap-2.5 rounded-2xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 aspect-square place-items-center rounded-full bg-surface-muted text-sm font-bold">
                      {r.authorName.slice(0, 1)}
                    </span>
                    <div className="leading-tight">
                      <b className="text-sm">{r.authorName}</b>
                      {r.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                          <LuBadgeCheck size={12} /> Verified purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</span>
                </div>

                <RatingStars value={r.rating} />
                {r.title && <b className="text-sm">{r.title}</b>}
                <p className="text-sm leading-relaxed text-muted-foreground">{r.body}</p>

                <button
                  type="button"
                  onClick={() => toggleHelpful(r.id)}
                  aria-pressed={helpful.has(r.id)}
                  className={cn(
                    "flex w-max items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition",
                    helpful.has(r.id) ? "border-primary bg-primary-soft text-link" : "border-border hover:border-border-strong",
                  )}
                >
                  <LuThumbsUp size={13} /> Helpful ({r.helpfulCount + (helpful.has(r.id) ? 1 : 0)})
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
