import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] px-3 text-sm text-[color:var(--personal-text)] outline-none transition focus:border-[color:var(--personal-accent)] focus:ring-2 focus:ring-[color:var(--personal-accent-muted)]",
        className
      )}
      {...props}
    />
  );
});

Select.displayName = "Select";
