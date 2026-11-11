import { LuBaby, LuCupSoda, LuPackage, LuTruck } from "react-icons/lu";
import type { PaymentOffer, PromoTile, Referral } from "../types/catalog";

export const paymentOffer: PaymentOffer = {
  code: "PAYJC",
  amount: "Rs. 150",
  minOrder: "Rs. 1,000",
  methods: ["JazzCash", "Easypaisa"],
};

export const referral: Referral = {
  title: "Invite a friend, you both get Rs. 200",
  text: "Credit is added to your wallet after their first order.",
  cta: "Invite friends",
  to: "/account/refer",
};

export const promoTiles: PromoTile[] = [
  {
    id: "pantry",
    to: "/category/pantry",
    badge: "Save up to 15%",
    title: "Monthly pantry box",
    text: "Rice, oil, flour and tea in one order",
    meta: "Free delivery",
    icon: LuPackage,
    tone: "tint2",
    area: "lg:col-span-4",
  },
  {
    id: "buy2",
    to: "/category/beverages",
    badge: "Buy 2 get 1",
    title: "Cold drinks combo",
    text: "On selected juices and soft drinks",
    meta: "Ends Sunday",
    icon: LuCupSoda,
    tone: "tint3",
    area: "lg:col-span-3",
  },
  {
    id: "delivery",
    to: "/deals",
    badge: "Free delivery",
    title: "Free over Rs. 2,000",
    text: "Delivered in 2 hours across 14 zones",
    icon: LuTruck,
    tone: "ink",
    area: "lg:col-span-4",
  },
  {
    id: "baby",
    to: "/category/baby",
    badge: "Up to 25% off",
    title: "Baby essentials",
    text: "Diapers, food and daily care",
    icon: LuBaby,
    tone: "tint4",
    area: "lg:col-span-3",
  },
];
