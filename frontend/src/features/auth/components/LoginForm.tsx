import { Field, Form, Formik } from "formik";
import type { FormikHelpers } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuArrowRight, LuInfo, LuLock } from "react-icons/lu";
import Button from "../../../components/ui/Button";
import FormikPhoneField from "../../../components/forms/FormikPhoneField";
import { normalizePhone } from "../../../lib/phone";
import { AuthError, requestLoginCode } from "../api/auth.api";
import { loginSchema } from "../lib/loginSchema";
import type { LoginValues } from "../types/auth.types";

const initialValues: LoginValues = { phone: "", website: "" };

interface FormStatus {
  message: string;
  showRegister?: boolean;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  /** Runs when the form is valid. Sends a code to an existing account */
  const login_user = async (values: LoginValues, helpers: FormikHelpers<LoginValues>) => {
    helpers.setStatus(null);
    const phone = normalizePhone(values.phone) ?? values.phone;

    // Debug details. Development only: never log phone numbers in a production build
    if (import.meta.env.DEV) {
      console.groupCollapsed("[login_user] submit");
      console.log("phone:", phone);
      console.log("honeypot filled:", values.website !== "");
      console.log("return to after signing in:", from);
      console.groupEnd();
    }

    // Bots fill the hidden field. Look busy, then do nothing
    if (values.website) {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      return;
    }

    try {
      const info = await requestLoginCode(phone);
      if (import.meta.env.DEV) console.log("[login_user] code sent:", info);

      navigate("/verify-phone", { replace: true, state: { from } });
    } catch (error) {
      if (import.meta.env.DEV) console.error("[login_user] failed:", error);

      if (error instanceof AuthError && error.code === "NO_ACCOUNT") {
        helpers.setFieldError("phone", error.message);
        helpers.setStatus({ message: error.message, showRegister: true } satisfies FormStatus);
      } else {
        helpers.setStatus({
          message: error instanceof AuthError ? error.message : "We could not send the code. Please try again.",
        } satisfies FormStatus);
      }
    }
  };

  return (
    <Formik<LoginValues> initialValues={initialValues} validationSchema={loginSchema} onSubmit={login_user}>
      {({ isSubmitting, status }) => {
        const formStatus = status as FormStatus | null;

        return (
          <Form noValidate className="grid gap-5">
            <FormikPhoneField name="phone" label="Mobile number" hint="We will send a 6-digit code to this number" />

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
                  {formStatus.showRegister && (
                    <Link to="/register" state={location.state} className="underline">Create an account</Link>
                  )}
                </span>
              </div>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="min-h-14 w-full text-base">
              {isSubmitting ? (
                <>
                  <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending code...
                </>
              ) : (
                <>
                  Send code <LuArrowRight size={18} className="rtl:rotate-180" />
                </>
              )}
            </Button>

            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <LuLock size={13} /> We only use your number to verify it is you.
            </p>

            <p className="text-center text-sm text-muted-foreground">
              New to SNT Supermart?{" "}
              <Link to="/register" state={location.state} className="font-bold text-link hover:underline">Create account</Link>
            </p>
          </Form>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
