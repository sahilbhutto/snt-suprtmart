import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { AuthUser } from "../../auth/store/authStore";
import { useAuthStore } from "../../auth/store/authStore";
import { normalizePhone, stepFields, validateStep, validateValues } from "../lib/validation";
import type { CheckoutErrors, CheckoutValues, StepId, StepStatus, TextField } from "../types/checkout.types";

export const STEP_ORDER: StepId[] = ["contact", "address", "payment", "review"];
/** Steps that have fields to fill. Review only confirms */
const FORM_STEPS: StepId[] = ["contact", "address", "payment"];

const DRAFT_KEY = "snt-checkout-draft";
type Draft = Partial<Pick<CheckoutValues, "area" | "address" | "landmark">>;

/** Only the address is remembered. Contact comes from the account, payment is never saved */
const readDraft = (): Draft => {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw) as Record<string, unknown>;
    const draft: Draft = {};
    for (const key of ["area", "address", "landmark"] as const) {
      if (typeof data[key] === "string") draft[key] = data[key] as string;
    }
    return draft;
  } catch {
    return {};
  }
};

const saveDraft = (v: CheckoutValues) => {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ area: v.area, address: v.address, landmark: v.landmark }));
  } catch {
    /* ignore */
  }
};

type Done = Record<StepId, boolean>;
const firstIncomplete = (done: Done): StepId | null => STEP_ORDER.find((s) => !done[s]) ?? null;

/** "03001234567" becomes "3001234567", because the input shows +92 in front */
const phoneForInput = (phone: string) => normalizePhone(phone)?.slice(1) ?? phone;

const makeInitial = (user: AuthUser | null) => {
  const values: CheckoutValues = {
    fullName: user?.fullName ?? "",
    phone: user ? phoneForInput(user.phone) : "",
    email: user?.email ?? "",
    area: "",
    address: "",
    landmark: "",
    paymentMethod: "cod",
    walletNumber: "",
    ...readDraft(),
  };
  const completed: Done = { contact: false, address: false, payment: false, review: false };
  return { values, completed, active: "contact" as StepId | null };
};

export const useCheckoutForm = () => {
  const user = useAuthStore((s) => s.user);
  const [initial] = useState(() => makeInitial(user));

  const [values, setValues] = useState<CheckoutValues>(initial.values);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [completed, setCompleted] = useState<Done>(initial.completed);
  const [active, setActive] = useState<StepId | null>(initial.active);

  const live = useMemo(() => validateValues(values), [values]);

  const setValue = useCallback(<K extends keyof CheckoutValues>(field: K, value: CheckoutValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const clearWallet = field === "paymentMethod" && prev.walletNumber;
      if (!prev[field] && !clearWallet) return prev;
      return { ...prev, [field]: undefined, ...(field === "paymentMethod" ? { walletNumber: undefined } : {}) };
    });
  }, []);

  const touch = useCallback((field: keyof CheckoutValues) => setErrors((prev) => ({ ...prev, [field]: live[field] })), [live]);

  /** Validates one step. If it is fine, marks it complete and opens the next unfinished step */
  const continueStep = useCallback(
    (id: StepId) => {
      const stepErrors = validateStep(id, values);
      const keys = stepFields[id];
      const firstBad = keys.find((k) => stepErrors[k]);

      setErrors((prev) => {
        const next = { ...prev };
        for (const k of keys) next[k] = stepErrors[k];
        return next;
      });

      if (firstBad) {
        window.setTimeout(() => document.getElementById(`field-${firstBad}`)?.focus(), 0);
        return false;
      }

      const nextDone: Done = { ...completed, [id]: true };
      setCompleted(nextDone);
      setActive(firstIncomplete(nextDone));
      if (id === "address") saveDraft(values);
      return true;
    },
    [values, completed],
  );

  /** Re-opens the step before this one (it stays complete, so nothing is lost) */
  const goBack = (id: StepId) => {
    const i = STEP_ORDER.indexOf(id);
    if (i > 0) setActive(STEP_ORDER[i - 1]);
  };

  const status = (id: StepId): StepStatus => (active === id ? "active" : completed[id] ? "complete" : "locked");

  const edit = (id: StepId) => {
    if (completed[id]) setActive(id);
  };

  /** Used by "Confirm order". Reopens any step that needs attention */
  const prepareSubmit = (): boolean => {
    const all = validateValues(values);
    const invalid = FORM_STEPS.find((s) => stepFields[s].some((f) => all[f]));
    if (invalid) {
      setErrors(all);
      setCompleted((c) => ({ ...c, [invalid]: false }));
      setActive(invalid);
      return false;
    }
    const missing = FORM_STEPS.find((s) => !completed[s]);
    if (missing) {
      setActive(missing);
      return false;
    }
    return true;
  };

  // Scroll the newly opened step into view (not on first load)
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (active) document.getElementById(`step-${active}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const bind = (field: TextField) => ({
    id: `field-${field}`,
    name: field,
    value: values[field],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setValue(field, e.target.value),
    onBlur: () => touch(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `field-${field}-error` : undefined,
  });

  return {
    values,
    errors,
    active,
    status,
    edit,
    goBack,
    continueStep,
    prepareSubmit,
    setValue,
    bind,
    totalSteps: STEP_ORDER.length,
    canPlace: active === "review" && FORM_STEPS.every((s) => completed[s]),
  };
};

export type CheckoutFormState = ReturnType<typeof useCheckoutForm>;
