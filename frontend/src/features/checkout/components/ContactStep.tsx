import { LuArrowRight } from "react-icons/lu";
import Button from "../../../components/ui/Button";
import FormField, { inputClass } from "../../../components/ui/FormField";
import type { CheckoutFormState } from "../hooks/useCheckoutForm";
import PhoneInput from "./PhoneInput";

const ContactStep = ({ form }: { form: CheckoutFormState }) => {
  const { errors, bind, continueStep } = form;

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
           <FormField id="field-fullName" label="Full name" error={errors.fullName}>
          <input {...bind("fullName")} autoComplete="name" placeholder="e.g. Ayesha Khan" className={inputClass(!!errors.fullName)} />
        </FormField>

        <FormField id="field-phone" label="Mobile number" error={errors.phone} hint="The rider will call this number">
          <PhoneInput {...bind("phone")} hasError={!!errors.phone} />
        </FormField>
      </div>

      <FormField id="field-email" label="Email" optional error={errors.email} hint="For your receipt">
        <input {...bind("email")} type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" className={inputClass(!!errors.email)} />
      </FormField>
    </div>
  );
};

export default ContactStep;
