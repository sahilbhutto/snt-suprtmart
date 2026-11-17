import { DELIVERY_ETA_MINUTES } from "../../../lib/constants";
import type { OrderRequest, PlacedOrder, PlacedOrderItem } from "../types/checkout.types";

const KEY = "snt-last-order";
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

interface Preview {
  items: PlacedOrderItem[];
  itemCount: number;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
}

/**
 * MOCK. Later: POST /api/orders with the OrderRequest. The server checks every item
 * against the database, recalculates all totals and returns the placed order.
 */
export const placeOrder = async (request: OrderRequest, preview: Preview): Promise<PlacedOrder> => {
  await wait(900);

  const number = `SNT-${String(Date.now()).slice(-7)}`;
  const order: PlacedOrder = {
    id: `order-${number}`,
    number,
    ...preview,
    paymentMethod: request.payment.method,
    paymentStatus: request.payment.method === "cod" ? "cod" : "pending",
    etaMinutes: DELIVERY_ETA_MINUTES,
    customerName: request.customer.fullName,
    phone: request.customer.phone,
    city: request.address.city,
    area: request.address.area,
    street: request.address.street,
    createdAt: new Date().toISOString(),
  };

  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
  return order;
};

export const getLastOrder = (number: string): PlacedOrder | null => {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const order = raw ? (JSON.parse(raw) as PlacedOrder) : null;
    return order && order.number === number ? order : null;
  } catch {
    return null;
  }
};
