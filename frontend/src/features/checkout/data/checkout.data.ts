import type { PaymentOption } from "../types/checkout.types";

export const SERVICE_CITY = "Larkana";
export const SERVICE_PROVINCE = "Sindh";

/**
 * PLACEHOLDERS. Replace with your real delivery zones.
 * Later this list comes from GET /api/delivery/areas (your admin Delivery zones).
 */
export const deliveryAreas: string[] = [
  "Dokri Road",
  "Railway Station area",
  "Chandka Medical College area",
];

export const paymentOptions: PaymentOption[] = [
  { id: "cod", label: "Cash on delivery", description: "Pay the rider when your order arrives", requiresWallet: false },
  { id: "easypaisa", label: "Easypaisa", description: "Pay from your Easypaisa account", requiresWallet: true, offer: "PAYJC: Rs. 150 off" },
  { id: "jazzcash", label: "JazzCash", description: "Pay from your JazzCash account", requiresWallet: true, offer: "PAYJC: Rs. 150 off" },
  { id: "card", label: "Card or bank", description: "Visa, Mastercard and bank transfer", requiresWallet: false },
];
