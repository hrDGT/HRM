"use client";

import { useState } from "react";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type Props<T extends FieldValues> = {
  name: Path<T>;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  autoComplete?: "new-password" | "current-password";
  hasProtectIcon?: boolean;
};

export function ControlledPasswordInput<T extends FieldValues>({
  name,
  placeholder,
  autoFocus,
  autoComplete,
  hasProtectIcon = true,
}: Props<T>) {
  const [showPassword, setShowPassword] = useState(!hasProtectIcon);

  const { register, getFieldState, formState } = useFormContext<T>();
  const fieldState = getFieldState(name, formState);
  console.log(hasProtectIcon);
  return (
    <Field data-invalid={fieldState.invalid}>
      <InputGroup
        className="min-h-12 px-3 focus-visible:border-main-text hover:border-main-text"
        data-invalid={fieldState.invalid}
      >
        <InputGroupInput
          {...register(name)}
          id={name}
          name={name}
          autoFocus={autoFocus}
          type={showPassword ? "text" : "password"}
          aria-invalid={fieldState.invalid}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-full w-full hover:scale-110"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {hasProtectIcon &&
              (showPassword ? (
                <EyeOff
                  className="size-6 text-secondary-text"
                  strokeWidth={3}
                />
              ) : (
                <Eye className="size-6 text-secondary-text" strokeWidth={3} />
              ))}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
