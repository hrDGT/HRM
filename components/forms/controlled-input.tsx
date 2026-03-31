"use client";

import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ControlledInputProps<T extends FieldValues> {
  name: Path<T>;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
}

export function ControlledInput<T extends FieldValues>({
  name,
  placeholder,
  type = "text",
  autoFocus,
}: ControlledInputProps<T>) {
  const { register, getFieldState, formState } = useFormContext<T>();
  const fieldState = getFieldState(name, formState);

  return (
    <Field data-invalid={fieldState.invalid}>
      <Input
        {...register(name)}
        autoFocus={autoFocus}
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={fieldState.invalid}
        className="min-h-12 px-3 focus-visible:border-main-text hover:border-main-text"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
