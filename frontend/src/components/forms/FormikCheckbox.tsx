import { ErrorMessage, Field } from "formik";
import type { ReactNode } from "react";
import FieldError from "./FieldError";

const FormikCheckbox = ({ name, children }: { name: string; children: ReactNode }) => {
  const id = `field-${name}`;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
        <Field id={id} name={name} type="checkbox" className="mt-0.5 size-[18px] shrink-0 accent-primary" />
        <span>{children}</span>
      </label>
      <ErrorMessage name={name}>{(message) => <FieldError id={`${id}-error`}>{message}</FieldError>}</ErrorMessage>
    </div>
  );
};

export default FormikCheckbox;
