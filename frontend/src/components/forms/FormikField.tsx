import { ErrorMessage, Field, useField } from "formik";
import type { InputHTMLAttributes } from "react";
import { inputClass } from "../ui/FormField";
import FieldError from "./FieldError";

interface FormikFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "className"> {
  name: string;
  label: string;
  hint?: string;
  optional?: boolean;
}

const FormikField = ({ name, label, hint, optional, ...inputProps }: FormikFieldProps) => {
  const [, meta] = useField(name);
  const id = `field-${name}`;
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <div className="grid content-start gap-1.5">
      <label htmlFor={id} className="flex items-center justify-between text-sm font-semibold">
        <span>{label}</span>
        {optional && <span className="text-xs font-medium text-muted-foreground">Optional</span>}
      </label>

      <Field
        id={id}
        name={name}
        {...inputProps}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputClass(hasError)}
      />

      <ErrorMessage name={name}>{(message) => <FieldError id={`${id}-error`}>{message}</FieldError>}</ErrorMessage>
      {!hasError && hint && <p id={`${id}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
};

export default FormikField;
