"use client";

import { useFormContext, type FieldValues, type Path } from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ControlledPasswordInputProps<T extends FieldValues> {
  name: Path<T>;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  autoComplete?: "new-password" | "current-password";
}

export function ControlledPasswordInput<T extends FieldValues>({
  name,
  placeholder,
  autoFocus,
  autoComplete,
}: ControlledPasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const { register, getFieldState, formState } = useFormContext<T>();
  const fieldState = getFieldState(name, formState);

  return (
    <Field data-invalid={fieldState.invalid}>
      <InputGroup
        className="min-h-12 px-3  focus-visible:border-main-text hover:border-main-text"
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
            {showPassword ? (
              <EyeOff className="size-6 text-secondary-text" strokeWidth={3} />
            ) : (
              <Eye className="size-6 text-secondary-text" strokeWidth={3} />
            )}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
