import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 border bg-transparent px-3 py-2 text-base text-white transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-red-500/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
        className
      )}
      {...props}
    />
  );
}

interface LabeledInputProps extends React.ComponentProps<"input"> {
  label: string;
}

function LabeledInput({ label, className, id, ...props }: LabeledInputProps) {
  return (
    <div className="relative group mt-4">
      <Input
        id={id}
        className={cn(
          "peer border-gray-500 focus-visible:border-red-500", 
          className
        )}
        placeholder=" "
        {...props}
      />

      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 pointer-events-none z-10",
          "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-red-500 peer-focus:bg-background peer-focus:px-1",
          "peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-red-500 peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:px-1"
        )}
      >
        {label}
      </label>
    </div>
  );
}

interface LabeledTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
}

function LabeledTextarea({ label, className, id, ...props }: LabeledTextareaProps) {
  return (
    <div className="relative mt-4">
      <textarea
        id={id}
        className={cn(
          "peer w-full border border-gray-500 focus-visible:border-red-500 bg-transparent px-3 py-2 text-sm text-white transition-colors outline-none placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-red-500/50 resize-none",
          className
        )}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 top-6 -translate-y-1/2 text-gray-500 transition-all duration-200 pointer-events-none z-10",
          "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-red-500 peer-focus:bg-neutral-700 peer-focus:px-1",
          "peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-red-500 peer-[:not(:placeholder-shown)]:bg-neutral-700 peer-[:not(:placeholder-shown)]:px-1"
        )}
      >
        {label}
      </label>
    </div>
  );
}

export { Input, LabeledInput, LabeledTextarea };