import type { FooterColumn } from "../../../types/catalog";

export const footerColumns: FooterColumn[] = [
  { title: "Shop", links: [
    { label: "All products", to: "/products" },
    { label: "All categories", to: "/categories" },
    { label: "Deals", to: "/deals" },
  ] },
  { title: "Help", links: [
    { label: "Track order", to: "/track" },
    { label: "Delivery areas", to: "/help#delivery" },
    { label: "FAQ", to: "/help" },
  ] },
  { title: "Legal", links: [
    { label: "Terms", to: "/legal/terms" },
    { label: "Privacy", to: "/legal/privacy" },
    { label: "Refunds", to: "/legal/refunds" },
  ] },
];

export const paymentMethods = ["COD", "Easypaisa", "JazzCash", "Visa", "Mastercard"];
