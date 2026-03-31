import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full border border-input bg-transparent text-sm transition-colors",
        "placeholder:text-secondary-text",
        "focus-visible:outline-none focus-visible:border-main-text",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        "aria-invalid:placeholder:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
