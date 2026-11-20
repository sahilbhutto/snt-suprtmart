import { ErrorMessage, useField } from "formik";
import { cn } from "../../lib/cn";
import FieldError from "./FieldError";

interface FormikPhoneFieldProps {
  name: string;
  label: string;
  hint?: string;
}

/** Mobile number with a fixed +92 in front. Only digits and spaces are allowed */
const FormikPhoneField = ({ name, label, hint }: FormikPhoneFieldProps) => {
  const [field, meta, helpers] = useField<string>(name);
  const id = `field-${name}`;
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>

      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-xl border bg-background px-4 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-ring",
          hasError ? "border-danger" : "border-border",
        )}
      >
        <span className="border-e border-border pe-3 text-sm font-bold text-muted-foreground">+92</span>
        <input
          {...field}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="300 1234567"
          maxLength={14}
          onChange={(e) => helpers.setValue(e.target.value.replace(/[^\d\s]/g, ""))}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle-foreground"
        />
      </div>

      <ErrorMessage name={name}>{(message) => <FieldError id={`${id}-error`}>{message}</FieldError>}</ErrorMessage>
      {!hasError && hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

export default FormikPhoneField;
