import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('mx-auto w-full max-w-7xl px-4 md:px-8', className)}>{children}</div>
);


export default Container
