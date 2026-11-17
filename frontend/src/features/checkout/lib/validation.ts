import { deliveryAreas, paymentOptions } from "../data/checkout.data";
import type { CheckoutErrors, CheckoutValues, StepId } from "../types/checkout.types";

/** "+92 300 1234567", "0300-1234567" and "3001234567" all become "03001234567". Returns null when invalid */
export const normalizePhone = (input: string): string | null => {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("92")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return /^3\d{9}$/.test(digits) ? `0${digits}` : null;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const stepFields: Record<StepId, (keyof CheckoutValues)[]> = {
  contact: ["fullName", "phone", "email"],
  address: ["area", "address"],
  payment: ["walletNumber"],
  review: [],
};

export const validateValues = (v: CheckoutValues): CheckoutErrors => {
  const errors: CheckoutErrors = {};

  if (v.fullName.trim().length < 3) errors.fullName = "Enter your full name";
  if (!normalizePhone(v.phone)) errors.phone = "Enter a valid mobile number, like 0300 1234567";
  if (v.email.trim() && !EMAIL.test(v.email.trim())) errors.email = "Enter a valid email address";

  if (!v.area || !deliveryAreas.includes(v.area)) errors.area = "Choose your area";
  if (v.address.trim().length < 8) errors.address = "Enter your house number and street";

  const method = paymentOptions.find((p) => p.id === v.paymentMethod);
  if (method?.requiresWallet && !normalizePhone(v.walletNumber)) {
    errors.walletNumber = `Enter your ${method.label} mobile number`;
  }

  return errors;
};

export const validateStep = (step: StepId, v: CheckoutValues): CheckoutErrors => {
  const all = validateValues(v);
  const result: CheckoutErrors = {};
  for (const field of stepFields[step]) {
    if (all[field]) result[field] = all[field];
  }
  return result;
};
