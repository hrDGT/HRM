import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full border border-input bg-transparent px-3 py-3 text-sm transition-colors",
        "placeholder:text-secondary-text",
        "focus-visible:outline-none focus-visible:border-main-text",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
