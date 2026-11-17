import { LuArrowRight, LuMapPin } from "react-icons/lu";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import FormField, { inputClass } from "../../../components/ui/FormField";
import { cn } from "../../../lib/cn";
import { SERVICE_CITY, SERVICE_PROVINCE, deliveryAreas } from "../data/checkout.data";
import type { CheckoutFormState } from "../hooks/useCheckoutForm";
import DeliveryPromise from "./DeliveryPromise";

const AddressStep = ({ form }: { form: CheckoutFormState }) => {
  const { errors, bind, continueStep } = form;

  return (
    <div className="grid gap-5">
      {/* The city is fixed: we only deliver in Larkana */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface-muted p-4">
        <span className="grid size-10 shrink-0 aspect-square place-items-center rounded-xl bg-surface text-link">
          <LuMapPin size={18} />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <b className="block text-sm">{SERVICE_CITY}, {SERVICE_PROVINCE}</b>
          <span className="text-xs text-muted-foreground">We currently deliver only in {SERVICE_CITY}</span>
        </div>
        <Badge tone="success">Available</Badge>
      </div>


 <FormField id="field-area" label="Area" error={errors.area}>
        <select {...bind("area")} className={inputClass(!!errors.area)}>
          <option value="">Select your area</option>
          {deliveryAreas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </FormField>

      <FormField id="field-address" label="House number and street" error={errors.address}>
        <textarea
          {...bind("address")}
          rows={2}
          autoComplete="street-address"
          placeholder="House 12, Street 5, Block B"
          className={cn(inputClass(!!errors.address), "h-auto min-h-20 py-3")}
        />
      </FormField>

      <FormField id="field-landmark" label="Nearby landmark" optional hint="A mosque, shop or school helps the rider find you">
        <input {...bind("landmark")} placeholder="e.g. Near Al-Noor Mosque" className={inputClass()} />
      </FormField>

      <DeliveryPromise />
    </div>
  );
};

export default AddressStep;
