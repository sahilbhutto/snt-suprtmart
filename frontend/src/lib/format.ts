import type { Tint } from "../types/catalog";

export const formatPrice = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) return "Rs. —";
  return `Rs. ${value.toLocaleString("en-PK")}`;
};

export const formatCount = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) return "0";
  return value.toLocaleString("en-PK");
};

export const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export const tintBg: Record<Tint, string> = {
  1: "bg-tint-1",
  2: "bg-tint-2",
  3: "bg-tint-3",
  4: "bg-tint-4",
  5: "bg-tint-5",
  6: "bg-tint-6",
};
