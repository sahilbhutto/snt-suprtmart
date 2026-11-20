import { useState } from "react";
import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuArrowRight, LuInfo, LuLock } from "react-icons/lu";
import Button from "../../../components/ui/Button";
import FormikCheckbox from "../../../components/forms/FormikCheckbox";
import FormikField from "../../../components/forms/FormikField";
import FormikPhoneField from "../../../components/forms/FormikPhoneField";
import { normalizePhone } from "../../../lib/phone";
import { AuthError, registerAccount } from "../api/auth.api";
import { registerSchema } from "../lib/registerSchema";
import type { RegisterRequest, RegisterValues } from "../types/auth.types";

const initialValues: RegisterValues = {
  fullName: "",
  phone: "",
  email: "",
  referralCode: "",
  acceptTerms: false,
  marketingOptIn: false,
  website: "",
};

interface FormStatus {
  message: string;
  showSignIn?: boolean;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [showReferral, setShowReferral] = useState(false);

  /** Runs when the form is valid. Creates the account (is_verify = false) and starts phone verification */
  const register_user = async (values: RegisterValues, helpers: FormikHelpers<RegisterValues>) => {
    helpers.setStatus(null);

    const payload: RegisterRequest = {
      fullName: values.fullName.trim().replace(/\s+/g, " "),
      phone: normalizePhone(values.phone) ?? values.phone,
      email: values.email.trim() || undefined,
      referralCode: values.referralCode.trim().toUpperCase() || undefined,
      marketingOptIn: values.marketingOptIn,
      acceptedTerms: true,
    };

    // Debug details. Development only: never log phone numbers in a production build
    if (import.meta.env.DEV) {
      console.groupCollapsed("[register_user] submit");
      console.log("payload:", payload);
      console.log("honeypot filled:", values.website !== "");
      console.log("return to after verifying:", from);
      console.groupEnd();
    }

    // Bots fill the hidden field. Look busy, then do nothing
    if (values.website) {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      return;
    }

    try {
      const info = await registerAccount(payload);

      if (import.meta.env.DEV) console.log("[register_user] verification started:", info);

      navigate("/verify-phone", { replace: true, state: { from } });
    } catch (error) {
      if (import.meta.env.DEV) console.error("[register_user] failed:", error);

      if (error instanceof AuthError && error.code === "PHONE_EXISTS") {
        helpers.setFieldError("phone", error.message);
        helpers.setStatus({ message: error.message, showSignIn: true } satisfies FormStatus);
      } else {
        helpers.setStatus({
          message: error instanceof AuthError ? error.message : "We could not create your account. Please try again.",
        } satisfies FormStatus);
      }
    }
  };

  return (
    <Formik<RegisterValues> initialValues={initialValues} validationSchema={registerSchema} onSubmit={register_user}>
      {({ isSubmitting, status }) => {
        const formStatus = status as FormStatus | null;

        return (
          <Form noValidate className="grid gap-5">
            <FormikField name="fullName" label="Full name" placeholder="e.g. Ayesha Khan" autoComplete="name" />

            <FormikPhoneField name="phone" label="Mobile number" hint="We will send a 6-digit code to verify this number" />

            <FormikField name="email" label="Email" type="email" optional inputMode="email" autoComplete="email" placeholder="name@example.com" hint="Only used for your receipts" />

            {showReferral ? (
              <FormikField name="referralCode" label="Referral code" optional placeholder="e.g. AYESHA10" autoComplete="off" />
            ) : (
              <button type="button" onClick={() => setShowReferral(true)} className="w-max text-sm font-bold text-link hover:underline">
                Have a referral code?
              </button>
            )}

            <div className="grid gap-3.5 rounded-2xl bg-surface-muted p-4">
              <FormikCheckbox name="acceptTerms">
                I agree to the <Link to="/legal/terms" target="_blank" className="font-bold text-link hover:underline">Terms</Link> and{" "}
                <Link to="/legal/privacy" target="_blank" className="font-bold text-link hover:underline">Privacy policy</Link>
              </FormikCheckbox>
              <FormikCheckbox name="marketingOptIn">Send me offers and deals by SMS</FormikCheckbox>
            </div>

            {/* Honeypot: hidden from people, filled in by bots */}
            <div aria-hidden className="absolute -start-[9999px] size-0 overflow-hidden">
              <label>
                Website
                <Field name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {formStatus && (
              <div role="alert" className="flex items-start gap-2.5 rounded-2xl bg-danger-soft p-4 text-sm font-semibold text-danger">
                <LuInfo size={18} className="mt-px shrink-0" />
                <span>
                  {formStatus.message}{" "}
                  {formStatus.showSignIn && (
                    <Link to="/login" state={location.state} className="underline">Sign in</Link>
                  )}
                </span>
              </div>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="min-h-14 w-full text-base">
              {isSubmitting ? (
                <>
                  <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating your account...
                </>
              ) : (
                <>
                  Create account <LuArrowRight size={18} className="rtl:rotate-180" />
                </>
              )}
            </Button>

            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <LuLock size={13} /> Your details are encrypted and never shared.
            </p>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" state={location.state} className="font-bold text-link hover:underline">Sign in</Link>
            </p>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RegisterForm;
