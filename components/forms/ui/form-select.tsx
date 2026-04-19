"use client";

import {
  type FieldValues,
  type Path,
  useController,
  useFormContext,
} from "react-hook-form";

import { Field, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
};

export function FormSelect<T extends FieldValues>({
  name,
  options,
  placeholder = "Select an option",
  disabled,
}: Props<T>) {
  const { control } = useFormContext<T>();

  const {
    field: { value, onChange, disabled: fieldDisabled },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
  });

  return (
    <Field data-invalid={invalid}>
      <Select
        onValueChange={onChange}
        value={value || ""}
        disabled={disabled || fieldDisabled}
      >
        <SelectTrigger
          className={cn(
            "px-3 w-full min-h-12 text-base focus-visible:border-main-text hover:border-main-text cursor-pointer text-main-text",
            "data-placeholder:text-secondary-text",
            { "border-destructive hover:border-destructive": invalid },
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white py-2" sideOffset={5}>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="p-2 text-base focus-visible:border-main-text hover:bg-action-hover cursor-pointer data-[state=checked]:bg-main-red/20"
                aria-invalid={invalid}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {invalid && error && <FieldError errors={[error]} />}
    </Field>
  );
}
