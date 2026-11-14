import type { ReviewSummary, StarRating } from "../types/review.types";

const STARS: StarRating[] = [5, 4, 3, 2, 1];

/** Sample only. In production the API returns the real breakdown */
export const buildSampleSummary = (average: number, count: number): ReviewSummary => {
  const weights = (lambda: number) => [1, 2, 3, 4, 5].map((k) => Math.exp((k - 5) * lambda));
  const meanFor = (lambda: number) => {
    const w = weights(lambda);
    const total = w.reduce((a, b) => a + b, 0);
    return w.reduce((sum, x, i) => sum + x * (i + 1), 0) / total;
  };

  let lo = -4;
  let hi = 6;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (meanFor(mid) < average) lo = mid;
    else hi = mid;
  }

  const w = weights((lo + hi) / 2);
  const total = w.reduce((a, b) => a + b, 0);
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<StarRating, number>;

  let assigned = 0;
  for (const star of STARS) {
    breakdown[star] = Math.round((w[star - 1] / total) * count);
    assigned += breakdown[star];
  }
  breakdown[5] += count - assigned; // keep the total exact

  return { average, count, breakdown };
};
