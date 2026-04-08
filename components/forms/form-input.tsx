"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props<T extends FieldValues> = {
  name: Path<T>;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
};

export function ControlledInput<T extends FieldValues>({
  name,
  placeholder,
  type = "text",
  autoFocus,
}: Props<T>) {
  const { register, getFieldState, formState } = useFormContext<T>();
  const fieldState = getFieldState(name, formState);

  return (
    <Field data-invalid={fieldState.invalid}>
      <Input
        {...register(name)}
        autoFocus={autoFocus}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={fieldState.invalid}
        className="min-h-12 px-3 focus-visible:border-main-text hover:border-main-text"
        autoComplete="email"
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
