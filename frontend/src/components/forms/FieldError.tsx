import type { ReactNode } from "react";
import { LuInfo } from "react-icons/lu";

const FieldError = ({ id, children }: { id?: string; children: ReactNode }) => (
  <p id={id} role="alert" className="flex items-start gap-1.5 text-xs font-semibold text-danger">
    <LuInfo size={14} className="mt-px shrink-0" />
    <span>{children}</span>
  </p>
);

export default FieldError;
