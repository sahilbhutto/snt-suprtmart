import { LuTruck } from "react-icons/lu";
import { FREE_DELIVERY_THRESHOLD } from "../../../lib/constants";
import { formatPrice } from "../../../lib/format";
import { deliveryPromise } from "../lib/eta";

const DeliveryPromise = () => (
  <div className="flex items-start gap-3 rounded-2xl bg-primary-soft p-4">
    <span className="grid size-10 shrink-0 aspect-square place-items-center rounded-xl bg-surface text-link">
      <LuTruck size={18} />
    </span>
    <p className="text-sm leading-snug">
      <b>Delivery {deliveryPromise()}</b> after we confirm your order.
      <span className="block text-xs text-muted-foreground">Free delivery over {formatPrice(FREE_DELIVERY_THRESHOLD)}.</span>
    </p>
  </div>
);

export default DeliveryPromise;
