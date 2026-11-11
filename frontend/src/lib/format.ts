import type { Tint } from "../types/catalog";

export const formatPrice = (value: number) => `Rs. ${value.toLocaleString('en-PK')}`;

export const formatCount = (value: number) => value.toLocaleString('en-PK');


export const tintBg: Record<Tint, string> = {
  1: "bg-tint-1",
  2: "bg-tint-2",
  3: "bg-tint-3",
  4: "bg-tint-4",
  5: "bg-tint-5",
  6: "bg-tint-6",
};
