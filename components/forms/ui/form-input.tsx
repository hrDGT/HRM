"use client";

import { type FieldValues, type Path, useFormContext } from "react-hook-form";

import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props<T extends FieldValues> = {
  name: Path<T>;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  autocompleteValue: string;
};

export function FormInput<T extends FieldValues>({
  name,
  placeholder,
  type = "text",
  autoFocus,
  autocompleteValue,
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
        className="min-h-12 px-3 text-base focus-visible:border-main-text hover:border-main-text"
        autoComplete={autocompleteValue}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
