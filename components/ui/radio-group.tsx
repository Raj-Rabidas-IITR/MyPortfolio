import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  hint?: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
}

export function RadioGroup({ name, value, onChange, options, className }: RadioGroupProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3", className)}>
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer rounded-xl border px-3 py-2 text-sm transition",
              selected
                ? "border-[color:var(--personal-accent)] bg-[color:var(--personal-accent-muted)] text-[color:var(--personal-accent-text)]"
                : "border-[color:var(--personal-border)] bg-[color:var(--personal-card-muted)] text-[color:var(--personal-muted)] hover:border-[color:var(--personal-accent)] hover:text-[color:var(--personal-text)]"
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={(event) => onChange(event.target.value)}
              className="sr-only"
            />
            <span className="font-medium">{option.label}</span>
            {option.hint ? <span className="mt-1 block text-xs text-[color:var(--personal-muted)]">{option.hint}</span> : null}
          </label>
        );
      })}
    </div>
  );
}
