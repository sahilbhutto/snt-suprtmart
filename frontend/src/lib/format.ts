import type { Tint } from "../types/catalog";

/** Safe number formatter – never throws on undefined/null/NaN */
export const formatPrice = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) return "Rs. —";
  return `Rs. ${value.toLocaleString("en-PK")}`;
};

/** Safe count formatter – never throws on undefined/null/NaN */
export const formatCount = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) return "0";
  return value.toLocaleString("en-PK");
};

export const tintBg: Record<Tint, string> = {
  1: "bg-tint-1",
  2: "bg-tint-2",
  3: "bg-tint-3",
  4: "bg-tint-4",
  5: "bg-tint-5",
  6: "bg-tint-6",
};
