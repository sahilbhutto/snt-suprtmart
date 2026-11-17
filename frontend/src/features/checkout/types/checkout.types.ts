export type PaymentMethodId = "cod" | "easypaisa" | "jazzcash" | "card";
export type StepId = "contact" | "address" | "payment" | "review";
export type StepStatus = "complete" | "active" | "locked";

export interface CheckoutValues {
  fullName: string;
  phone: string;
  email: string;
  area: string;
  address: string;
  landmark: string;
  paymentMethod: PaymentMethodId;
  walletNumber: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

export type TextField = "fullName" | "phone" | "email" | "area" | "address" | "landmark" | "walletNumber";

export interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  description: string;
  requiresWallet: boolean;
  offer?: string;
}

/** What the browser sends. The server recalculates prices, stock, coupon and delivery fee */
export interface OrderRequest {
  items: { productId: string; quantity: number }[];
  coupon: string | null;
  customer: { fullName: string; phone: string; email?: string };
  address: { city: string; area: string; street: string; landmark?: string };
  payment: { method: PaymentMethodId; walletNumber?: string };
}

export interface PlacedOrderItem {
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  lineTotal: number;
}

export interface PlacedOrder {
  id: string;
  number: string;
  items: PlacedOrderItem[];
  itemCount: number;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethodId;
  /** "pending" means the customer still has to approve an online payment */
  paymentStatus: "cod" | "pending";
  etaMinutes: number;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  createdAt: string; // ISO 8601
}
